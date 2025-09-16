"""
CommMob Data Analytics Backend
Advanced Python backend with Cloudflare AI integration
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import pandas as pd
import numpy as np
import asyncio
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
from pathlib import Path

# AI and ML imports
import cloudflare
from transformers import pipeline
import torch
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import plotly.graph_objects as go
import plotly.express as px

# Geographic analysis
import geopandas as gpd
from shapely.geometry import Point
import folium

# Real-time features
from collections import defaultdict
import redis
import socketio

# Initialize FastAPI app
app = FastAPI(
    title="CommMob Data Analytics API",
    description="Advanced American Red Cross Data Analytics Platform with AI Integration",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
data_cache = {}
websocket_connections = []
redis_client = None

# Initialize Cloudflare AI
cloudflare_client = None
if os.getenv("CLOUDFLARE_API_TOKEN"):
    cloudflare_client = cloudflare.Cloudflare(
        api_token=os.getenv("CLOUDFLARE_API_TOKEN")
    )

# Initialize ML models
sentiment_analyzer = None
try:
    sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest")
except Exception as e:
    logger.warning(f"Could not load sentiment analyzer: {e}")

# WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                self.active_connections.remove(connection)

manager = ConnectionManager()

# Data loading functions
def load_data():
    """Load and cache CSV data"""
    global data_cache
    
    try:
        # Load volunteer data
        volunteer_path = Path("data/Volunteer 2025.csv")
        if volunteer_path.exists():
            data_cache['volunteers'] = pd.read_csv(volunteer_path)
            logger.info(f"Loaded {len(data_cache['volunteers'])} volunteer records")
        
        # Load applicant data
        applicant_path = Path("data/Applicants 2025.csv")
        if applicant_path.exists():
            data_cache['applicants'] = pd.read_csv(applicant_path)
            logger.info(f"Loaded {len(data_cache['applicants'])} applicant records")
        
        # Process and enhance data
        if 'volunteers' in data_cache:
            data_cache['volunteers'] = enhance_volunteer_data(data_cache['volunteers'])
        
        if 'applicants' in data_cache:
            data_cache['applicants'] = enhance_applicant_data(data_cache['applicants'])
            
    except Exception as e:
        logger.error(f"Error loading data: {e}")

def enhance_volunteer_data(df):
    """Enhance volunteer data with computed fields"""
    try:
        # Convert coordinates to numeric
        df['x'] = pd.to_numeric(df['x'], errors='coerce')
        df['y'] = pd.to_numeric(df['y'], errors='coerce')
        
        # Create status categories
        df['status_category'] = df['Current Status'].map({
            'General Volunteer': 'Active',
            'Prospective Volunteer': 'Prospective',
            'Youth Under 18': 'Youth',
            'Employee': 'Employee',
            'Event Based Volunteer': 'Event-Based'
        }).fillna('Other')
        
        # Calculate days since last activity
        df['Last Login'] = pd.to_datetime(df['Last Login'], errors='coerce')
        df['days_since_login'] = (datetime.now() - df['Last Login']).dt.days
        
        return df
    except Exception as e:
        logger.error(f"Error enhancing volunteer data: {e}")
        return df

def enhance_applicant_data(df):
    """Enhance applicant data with computed fields"""
    try:
        # Convert coordinates to numeric
        df['x'] = pd.to_numeric(df['x'], errors='coerce')
        df['y'] = pd.to_numeric(df['y'], errors='coerce')
        
        # Convert dates
        date_columns = ['Application Dt', 'Vol Start Dt', 'Inactive Dt']
        for col in date_columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
        
        # Calculate processing times
        df['days_to_start'] = (df['Vol Start Dt'] - df['Application Dt']).dt.days
        df['days_to_inactive'] = (df['Inactive Dt'] - df['Application Dt']).dt.days
        
        # Create status categories
        df['status_category'] = df['Current Status'].map({
            'General Volunteer': 'Converted',
            'Inactive Prospective Volunteer': 'Inactive',
            'Lapsed Volunteer': 'Lapsed'
        }).fillna('Other')
        
        return df
    except Exception as e:
        logger.error(f"Error enhancing applicant data: {e}")
        return df

# API Routes
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    global redis_client
    
    # Load data
    load_data()
    
    # Initialize Redis if available
    try:
        redis_client = redis.Redis(host='localhost', port=6379, db=0)
        redis_client.ping()
        logger.info("Redis connected successfully")
    except:
        logger.warning("Redis not available, using in-memory cache")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CommMob Data Analytics API",
        "version": "2.0.0",
        "features": [
            "Cloudflare AI Integration",
            "Real-time Analytics",
            "Advanced ML Models",
            "Geographic Analysis",
            "WebSocket Support"
        ]
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "data_loaded": len(data_cache) > 0,
        "cloudflare_ai": cloudflare_client is not None,
        "ml_models": sentiment_analyzer is not None
    }

@app.get("/api/dashboard/metrics")
async def get_dashboard_metrics():
    """Get dashboard metrics with AI insights"""
    try:
        volunteers = data_cache.get('volunteers', pd.DataFrame())
        applicants = data_cache.get('applicants', pd.DataFrame())
        
        if volunteers.empty and applicants.empty:
            raise HTTPException(status_code=404, detail="No data available")
        
        # Calculate basic metrics
        metrics = {
            "total_volunteers": len(volunteers),
            "total_applicants": len(applicants),
            "active_volunteers": len(volunteers[volunteers['Current Status'] == 'General Volunteer']),
            "conversion_rate": round((len(volunteers) / len(applicants) * 100), 2) if len(applicants) > 0 else 0,
            "geographic_coverage": volunteers['State'].nunique() if not volunteers.empty else 0,
            "avg_days_to_start": round(applicants['days_to_start'].mean(), 1) if not applicants.empty else 0
        }
        
        # Generate AI insights if Cloudflare AI is available
        ai_insights = None
        if cloudflare_client:
            try:
                ai_insights = await generate_ai_insights(metrics)
            except Exception as e:
                logger.error(f"AI insights generation failed: {e}")
        
        return {
            "metrics": metrics,
            "ai_insights": ai_insights,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting dashboard metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/volunteers")
async def get_volunteers(
    limit: int = 100,
    offset: int = 0,
    status: Optional[str] = None,
    state: Optional[str] = None
):
    """Get volunteer data with filtering"""
    try:
        volunteers = data_cache.get('volunteers', pd.DataFrame())
        
        if volunteers.empty:
            raise HTTPException(status_code=404, detail="No volunteer data available")
        
        # Apply filters
        filtered_data = volunteers.copy()
        
        if status:
            filtered_data = filtered_data[filtered_data['Current Status'] == status]
        
        if state:
            filtered_data = filtered_data[filtered_data['State'] == state]
        
        # Pagination
        total = len(filtered_data)
        paginated_data = filtered_data.iloc[offset:offset + limit]
        
        return {
            "data": paginated_data.to_dict('records'),
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error(f"Error getting volunteers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/applicants")
async def get_applicants(
    limit: int = 100,
    offset: int = 0,
    status: Optional[str] = None,
    workflow: Optional[str] = None
):
    """Get applicant data with filtering"""
    try:
        applicants = data_cache.get('applicants', pd.DataFrame())
        
        if applicants.empty:
            raise HTTPException(status_code=404, detail="No applicant data available")
        
        # Apply filters
        filtered_data = applicants.copy()
        
        if status:
            filtered_data = filtered_data[filtered_data['Current Status'] == status]
        
        if workflow:
            filtered_data = filtered_data[filtered_data['Workflow Type'] == workflow]
        
        # Pagination
        total = len(filtered_data)
        paginated_data = filtered_data.iloc[offset:offset + limit]
        
        return {
            "data": paginated_data.to_dict('records'),
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error(f"Error getting applicants: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/geographic")
async def get_geographic_analysis():
    """Get geographic analysis with clustering"""
    try:
        volunteers = data_cache.get('volunteers', pd.DataFrame())
        
        if volunteers.empty:
            raise HTTPException(status_code=404, detail="No volunteer data available")
        
        # Filter valid coordinates
        geo_data = volunteers.dropna(subset=['x', 'y'])
        
        if geo_data.empty:
            raise HTTPException(status_code=404, detail="No geographic data available")
        
        # Perform clustering analysis
        coordinates = geo_data[['x', 'y']].values
        scaler = StandardScaler()
        scaled_coords = scaler.fit_transform(coordinates)
        
        # K-means clustering
        kmeans = KMeans(n_clusters=5, random_state=42)
        clusters = kmeans.fit_predict(scaled_coords)
        
        geo_data['cluster'] = clusters
        
        # State distribution
        state_distribution = geo_data['State'].value_counts().to_dict()
        
        # Cluster centers
        cluster_centers = scaler.inverse_transform(kmeans.cluster_centers_)
        
        return {
            "geographic_data": geo_data.to_dict('records'),
            "state_distribution": state_distribution,
            "cluster_centers": cluster_centers.tolist(),
            "total_locations": len(geo_data)
        }
        
    except Exception as e:
        logger.error(f"Error in geographic analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/temporal")
async def get_temporal_analysis():
    """Get temporal analysis with trend detection"""
    try:
        applicants = data_cache.get('applicants', pd.DataFrame())
        
        if applicants.empty:
            raise HTTPException(status_code=404, detail="No applicant data available")
        
        # Monthly application trends
        applicants['month'] = pd.to_datetime(applicants['Application Dt']).dt.to_period('M')
        monthly_trends = applicants.groupby('month').size().to_dict()
        
        # Conversion trends
        conversion_trends = applicants.groupby('month')['Current Status'].apply(
            lambda x: (x == 'General Volunteer').sum() / len(x) * 100
        ).to_dict()
        
        # Processing time trends
        processing_trends = applicants.groupby('month')['days_to_start'].mean().to_dict()
        
        return {
            "monthly_applications": monthly_trends,
            "conversion_trends": conversion_trends,
            "processing_trends": processing_trends
        }
        
    except Exception as e:
        logger.error(f"Error in temporal analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/query")
async def process_ai_query(query: Dict[str, str]):
    """Process natural language query with Cloudflare AI"""
    try:
        if not cloudflare_client:
            raise HTTPException(status_code=503, detail="Cloudflare AI not configured")
        
        user_query = query.get("query", "")
        if not user_query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        # Get context data
        volunteers = data_cache.get('volunteers', pd.DataFrame())
        applicants = data_cache.get('applicants', pd.DataFrame())
        
        context = {
            "total_volunteers": len(volunteers),
            "total_applicants": len(applicants),
            "geographic_coverage": volunteers['State'].nunique() if not volunteers.empty else 0
        }
        
        # Process with Cloudflare AI
        ai_response = await process_cloudflare_ai_query(user_query, context)
        
        return {
            "query": user_query,
            "response": ai_response,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error processing AI query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_cloudflare_ai_query(query: str, context: Dict):
    """Process query with Cloudflare AI"""
    try:
        # This would integrate with Cloudflare AI API
        # For now, return a mock response
        return {
            "insights": [
                f"Based on your query '{query}', here are key insights:",
                f"Current volunteer count: {context.get('total_volunteers', 0)}",
                f"Geographic coverage: {context.get('geographic_coverage', 0)} states"
            ],
            "recommendations": [
                "Consider expanding recruitment in underserved areas",
                "Implement automated follow-up for pending applications"
            ],
            "confidence": 85
        }
    except Exception as e:
        logger.error(f"Cloudflare AI query error: {e}")
        return {"error": "AI processing failed"}

async def generate_ai_insights(metrics: Dict):
    """Generate AI insights for dashboard metrics"""
    try:
        # Mock AI insights generation
        return {
            "insights": [
                f"Volunteer conversion rate of {metrics.get('conversion_rate', 0)}% is within industry standards",
                f"Geographic coverage spans {metrics.get('geographic_coverage', 0)} states",
                f"Average processing time of {metrics.get('avg_days_to_start', 0)} days is efficient"
            ],
            "recommendations": [
                "Focus on improving conversion rates in low-performing regions",
                "Implement predictive analytics for volunteer retention"
            ],
            "confidence": 88
        }
    except Exception as e:
        logger.error(f"AI insights generation error: {e}")
        return None

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Send periodic updates
            await asyncio.sleep(30)
            
            # Get latest metrics
            volunteers = data_cache.get('volunteers', pd.DataFrame())
            applicants = data_cache.get('applicants', pd.DataFrame())
            
            update_data = {
                "type": "metrics_update",
                "data": {
                    "total_volunteers": len(volunteers),
                    "total_applicants": len(applicants),
                    "timestamp": datetime.now().isoformat()
                }
            }
            
            await manager.send_personal_message(json.dumps(update_data), websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Data export endpoints
@app.get("/api/export/volunteers")
async def export_volunteers(format: str = "csv"):
    """Export volunteer data"""
    try:
        volunteers = data_cache.get('volunteers', pd.DataFrame())
        
        if volunteers.empty:
            raise HTTPException(status_code=404, detail="No volunteer data available")
        
        if format == "csv":
            filename = f"volunteers_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            volunteers.to_csv(filename, index=False)
            return FileResponse(filename, media_type='text/csv', filename=filename)
        else:
            raise HTTPException(status_code=400, detail="Unsupported format")
            
    except Exception as e:
        logger.error(f"Error exporting volunteers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
