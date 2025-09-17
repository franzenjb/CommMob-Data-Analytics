#!/usr/bin/env python3
"""
Red Cross Executive Analytics Engine
World-class data processing and AI analytics for executive decision-making
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import warnings
warnings.filterwarnings('ignore')

# Load environment variables
load_dotenv()

class ExecutiveDataProcessor:
    """Advanced data processing engine for Red Cross executive analytics"""
    
    def __init__(self):
        self.data_path = "../data"
        self.applicants_df = None
        self.volunteers_df = None
        self.biomed_df = None
        self.donors_df = None
        self.load_all_data()
        
    def load_all_data(self):
        """Load and preprocess all CSV data"""
        try:
            # Load Applicants data
            self.applicants_df = pd.read_csv(
                f"{self.data_path}/Applicants 2025.csv",
                low_memory=False
            )
            
            # Load Volunteers data
            self.volunteers_df = pd.read_csv(
                f"{self.data_path}/Volunteer 2025.csv",
                low_memory=False
            )
            
            # Load Biomed data
            self.biomed_df = pd.read_csv(
                f"{self.data_path}/Biomed.csv",
                encoding='utf-8-sig',
                low_memory=False
            )
            
            # Load Donors data
            self.donors_df = pd.read_csv(
                f"{self.data_path}/>\$5K donors past 12 months.csv",
                encoding='utf-8-sig'
            )
            
            # Clean donors data
            self.donors_df[' Gift $ '] = self.donors_df[' Gift $ '].str.replace('$', '').str.replace(',', '').str.strip()
            self.donors_df[' Gift $ '] = pd.to_numeric(self.donors_df[' Gift $ '], errors='coerce')
            
            print(f"✅ Loaded {len(self.applicants_df):,} applicants")
            print(f"✅ Loaded {len(self.volunteers_df):,} volunteers")
            print(f"✅ Loaded {len(self.biomed_df):,} blood drives")
            print(f"✅ Loaded {len(self.donors_df):,} major donors")
            
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            
    def get_executive_kpis(self) -> Dict[str, Any]:
        """Calculate high-level KPIs for executives"""
        kpis = {
            "timestamp": datetime.now().isoformat(),
            "volunteer_metrics": self._calculate_volunteer_metrics(),
            "financial_metrics": self._calculate_financial_metrics(),
            "operational_metrics": self._calculate_operational_metrics(),
            "geographic_metrics": self._calculate_geographic_metrics(),
            "predictive_insights": self._generate_predictive_insights()
        }
        return kpis
    
    def _calculate_volunteer_metrics(self) -> Dict:
        """Calculate volunteer-related KPIs"""
        if self.applicants_df is None or self.volunteers_df is None:
            return {}
            
        # Applicant metrics
        total_applicants = len(self.applicants_df)
        converted = self.applicants_df['Intake Outcome'].value_counts()
        conversion_rate = (converted.get('Converted to Volunteer', 0) / total_applicants * 100) if total_applicants > 0 else 0
        
        # Volunteer metrics
        total_volunteers = len(self.volunteers_df)
        status_counts = self.volunteers_df['Current Status'].value_counts()
        
        # Calculate growth trends
        if 'Application Dt' in self.applicants_df.columns:
            self.applicants_df['Application Dt'] = pd.to_datetime(self.applicants_df['Application Dt'], errors='coerce')
            recent_apps = self.applicants_df[self.applicants_df['Application Dt'] >= datetime.now() - timedelta(days=30)]
            monthly_growth = len(recent_apps)
        else:
            monthly_growth = 0
            
        return {
            "total_applicants": int(total_applicants),
            "total_volunteers": int(total_volunteers),
            "conversion_rate": round(conversion_rate, 1),
            "active_volunteers": int(status_counts.get('General Volunteer', 0)),
            "prospective_volunteers": int(status_counts.get('Prospective Volunteer', 0)),
            "youth_volunteers": int(status_counts.get('Youth Under 18', 0)),
            "monthly_new_applications": int(monthly_growth),
            "retention_rate": self._calculate_retention_rate(),
            "average_time_to_activate": self._calculate_time_to_activate()
        }
    
    def _calculate_financial_metrics(self) -> Dict:
        """Calculate financial KPIs"""
        if self.donors_df is None:
            return {}
            
        total_donations = self.donors_df[' Gift $ '].sum()
        avg_donation = self.donors_df[' Gift $ '].mean()
        median_donation = self.donors_df[' Gift $ '].median()
        top_10_donations = self.donors_df.nlargest(10, ' Gift $ ')[' Gift $ '].sum()
        
        return {
            "total_raised": float(total_donations),
            "total_donors": len(self.donors_df),
            "average_gift": float(avg_donation),
            "median_gift": float(median_donation),
            "top_10_concentration": float(top_10_donations / total_donations * 100) if total_donations > 0 else 0,
            "donors_over_100k": len(self.donors_df[self.donors_df[' Gift $ '] >= 100000]),
            "donors_over_1m": len(self.donors_df[self.donors_df[' Gift $ '] >= 1000000])
        }
    
    def _calculate_operational_metrics(self) -> Dict:
        """Calculate operational KPIs"""
        if self.biomed_df is None:
            return {}
            
        total_drives = len(self.biomed_df)
        
        # Calculate by year
        year_metrics = {}
        if 'Year' in self.biomed_df.columns:
            for year in self.biomed_df['Year'].unique():
                year_data = self.biomed_df[self.biomed_df['Year'] == year]
                year_metrics[str(year)] = {
                    "drives": len(year_data),
                    "total_collected": int(year_data['RBC Products Collected'].sum()) if 'RBC Products Collected' in year_data.columns else 0,
                    "efficiency": float(year_data['RBC Products Collected'].sum() / year_data['RBC Product Projection'].sum() * 100) if 'RBC Product Projection' in year_data.columns and year_data['RBC Product Projection'].sum() > 0 else 0
                }
        
        # Account type breakdown
        account_breakdown = {}
        if 'Account Type' in self.biomed_df.columns:
            account_breakdown = self.biomed_df['Account Type'].value_counts().to_dict()
            
        return {
            "total_blood_drives": total_drives,
            "drives_by_year": year_metrics,
            "account_type_breakdown": account_breakdown,
            "total_products_collected": int(self.biomed_df['RBC Products Collected'].sum()) if 'RBC Products Collected' in self.biomed_df.columns else 0,
            "collection_efficiency": float(self.biomed_df['RBC Products Collected'].sum() / self.biomed_df['RBC Product Projection'].sum() * 100) if 'RBC Product Projection' in self.biomed_df.columns and self.biomed_df['RBC Product Projection'].sum() > 0 else 0
        }
    
    def _calculate_geographic_metrics(self) -> Dict:
        """Calculate geographic distribution metrics"""
        geographic_data = {
            "volunteer_distribution": {},
            "donor_distribution": {},
            "blood_drive_distribution": {}
        }
        
        # Volunteer geographic distribution
        if self.volunteers_df is not None and 'State' in self.volunteers_df.columns:
            state_counts = self.volunteers_df['State'].value_counts().head(10)
            geographic_data["volunteer_distribution"] = state_counts.to_dict()
            
        # Blood drive geographic distribution
        if self.biomed_df is not None and 'St' in self.biomed_df.columns:
            state_drives = self.biomed_df['St'].value_counts().head(10)
            geographic_data["blood_drive_distribution"] = state_drives.to_dict()
            
        return geographic_data
    
    def _calculate_retention_rate(self) -> float:
        """Calculate volunteer retention rate"""
        if self.applicants_df is None:
            return 0.0
            
        if 'Intake Outcome' in self.applicants_df.columns:
            converted = self.applicants_df['Intake Outcome'].value_counts()
            total_converted = converted.get('Converted to Volunteer', 0)
            later_inactive = converted.get('Converted to Volunteer - Later Inactivated', 0)
            
            if total_converted + later_inactive > 0:
                return round((total_converted / (total_converted + later_inactive)) * 100, 1)
        return 0.0
    
    def _calculate_time_to_activate(self) -> float:
        """Calculate average time from application to volunteer start"""
        if self.applicants_df is None:
            return 0.0
            
        if 'Days To Vol Start' in self.applicants_df.columns:
            valid_days = self.applicants_df['Days To Vol Start'].dropna()
            valid_days = valid_days[valid_days > 0]
            if len(valid_days) > 0:
                return round(valid_days.mean(), 1)
        return 0.0
    
    def _generate_predictive_insights(self) -> List[Dict]:
        """Generate AI-powered predictive insights"""
        insights = []
        
        # Volunteer growth prediction
        if self.applicants_df is not None:
            monthly_growth_rate = self._calculate_volunteer_metrics().get('monthly_new_applications', 0)
            insights.append({
                "type": "volunteer_growth",
                "prediction": f"Based on current trends, expecting {int(monthly_growth_rate * 12):,} new applications in next 12 months",
                "confidence": 0.75,
                "recommendation": "Increase recruitment staff in high-growth regions"
            })
        
        # Blood drive optimization
        if self.biomed_df is not None:
            efficiency = self._calculate_operational_metrics().get('collection_efficiency', 0)
            if efficiency < 80:
                insights.append({
                    "type": "operational_efficiency",
                    "prediction": "Blood collection efficiency below target",
                    "confidence": 0.90,
                    "recommendation": "Focus on high-performing account types and optimize scheduling"
                })
        
        # Donor cultivation
        if self.donors_df is not None:
            top_concentration = self._calculate_financial_metrics().get('top_10_concentration', 0)
            if top_concentration > 30:
                insights.append({
                    "type": "donor_diversification",
                    "prediction": "High donor concentration risk",
                    "confidence": 0.85,
                    "recommendation": "Expand mid-level donor program to reduce dependency"
                })
                
        return insights
    
    def get_filtered_data(self, dataset: str, filters: Dict) -> List[Dict]:
        """Get filtered data based on parameters"""
        df = None
        
        if dataset == "applicants":
            df = self.applicants_df
        elif dataset == "volunteers":
            df = self.volunteers_df
        elif dataset == "biomed":
            df = self.biomed_df
        elif dataset == "donors":
            df = self.donors_df
            
        if df is None:
            return []
            
        # Apply filters
        for column, value in filters.items():
            if column in df.columns:
                if isinstance(value, list):
                    df = df[df[column].isin(value)]
                else:
                    df = df[df[column] == value]
                    
        # Convert to JSON-serializable format
        result = df.head(1000).replace({np.nan: None}).to_dict('records')
        return result
    
    def get_chart_data(self, chart_type: str) -> Dict:
        """Generate data for specific chart types"""
        if chart_type == "volunteer_timeline":
            return self._get_volunteer_timeline_data()
        elif chart_type == "geographic_heatmap":
            return self._get_geographic_heatmap_data()
        elif chart_type == "conversion_funnel":
            return self._get_conversion_funnel_data()
        elif chart_type == "blood_drive_trends":
            return self._get_blood_drive_trends()
        elif chart_type == "donor_distribution":
            return self._get_donor_distribution()
        else:
            return {}
    
    def _get_volunteer_timeline_data(self) -> Dict:
        """Generate volunteer timeline chart data"""
        if self.applicants_df is None:
            return {}
            
        # Parse dates and group by month
        if 'Application Dt' in self.applicants_df.columns:
            self.applicants_df['Application Dt'] = pd.to_datetime(self.applicants_df['Application Dt'], errors='coerce')
            monthly_apps = self.applicants_df.groupby(pd.Grouper(key='Application Dt', freq='M')).size()
            
            return {
                "labels": [d.strftime('%Y-%m') for d in monthly_apps.index[-12:]],
                "datasets": [{
                    "label": "Monthly Applications",
                    "data": monthly_apps.values[-12:].tolist()
                }]
            }
        return {}
    
    def _get_geographic_heatmap_data(self) -> List[Dict]:
        """Generate geographic heatmap data"""
        heatmap_data = []
        
        if self.volunteers_df is not None:
            # Group by coordinates
            if 'X' in self.volunteers_df.columns and 'Y' in self.volunteers_df.columns:
                coords = self.volunteers_df[['X', 'Y']].dropna()
                for _, row in coords.head(1000).iterrows():
                    heatmap_data.append({
                        "lat": float(row['Y']),
                        "lng": float(row['X']),
                        "intensity": 1
                    })
                    
        return heatmap_data
    
    def _get_conversion_funnel_data(self) -> Dict:
        """Generate conversion funnel data"""
        if self.applicants_df is None:
            return {}
            
        if 'Intake Outcome' in self.applicants_df.columns:
            outcomes = self.applicants_df['Intake Outcome'].value_counts()
            
            return {
                "stages": [
                    {"name": "Applied", "value": len(self.applicants_df)},
                    {"name": "Processed", "value": len(self.applicants_df) - outcomes.get('Pending', 0)},
                    {"name": "Converted", "value": outcomes.get('Converted to Volunteer', 0)},
                    {"name": "Active", "value": outcomes.get('Converted to Volunteer', 0) - outcomes.get('Converted to Volunteer - Later Inactivated', 0)}
                ]
            }
        return {}
    
    def _get_blood_drive_trends(self) -> Dict:
        """Generate blood drive trend data"""
        if self.biomed_df is None:
            return {}
            
        if 'Year' in self.biomed_df.columns:
            yearly_stats = self.biomed_df.groupby('Year').agg({
                'Drives': 'sum',
                'RBC Products Collected': 'sum'
            }).fillna(0)
            
            return {
                "labels": yearly_stats.index.tolist(),
                "datasets": [
                    {
                        "label": "Total Drives",
                        "data": yearly_stats['Drives'].tolist()
                    },
                    {
                        "label": "Products Collected",
                        "data": yearly_stats['RBC Products Collected'].tolist(),
                        "yAxisID": 'y2'
                    }
                ]
            }
        return {}
    
    def _get_donor_distribution(self) -> Dict:
        """Generate donor distribution data"""
        if self.donors_df is None:
            return {}
            
        # Create gift size buckets
        bins = [0, 10000, 25000, 50000, 100000, 500000, 1000000, float('inf')]
        labels = ['$5K-10K', '$10K-25K', '$25K-50K', '$50K-100K', '$100K-500K', '$500K-1M', '$1M+']
        
        self.donors_df['gift_bucket'] = pd.cut(self.donors_df[' Gift $ '], bins=bins, labels=labels)
        distribution = self.donors_df['gift_bucket'].value_counts().sort_index()
        
        return {
            "labels": distribution.index.tolist(),
            "datasets": [{
                "label": "Number of Donors",
                "data": distribution.values.tolist()
            }]
        }

class CloudflareAIAnalyzer:
    """AI-powered analytics using Cloudflare Workers AI"""
    
    def __init__(self):
        self.api_token = os.getenv('CLOUDFLARE_API_TOKEN')
        self.account_id = os.getenv('CLOUDFLARE_ACCOUNT_ID', '39511202383a0532d0e56b3fa1d5ac12')
        self.model = os.getenv('CLOUDFLARE_AI_MODEL', '@cf/meta/llama-2-7b-chat-int8')
        self.api_url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/ai/run/{self.model}"
        
    def analyze_data(self, query: str, context: Dict) -> Dict:
        """Analyze data using AI based on natural language query"""
        if not self.api_token:
            return {
                "error": "Cloudflare AI not configured",
                "suggestion": "Please set CLOUDFLARE_API_TOKEN in backend/.env file"
            }
            
        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
        
        # Prepare context for AI
        context_str = json.dumps(context, indent=2)[:2000]  # Limit context size
        
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are an executive data analyst for the American Red Cross. Analyze data and provide strategic insights for C-level executives. Be concise, specific, and action-oriented."
                },
                {
                    "role": "user",
                    "content": f"Data Context:\n{context_str}\n\nQuery: {query}\n\nProvide executive-level analysis and recommendations."
                }
            ],
            "max_tokens": 500,
            "temperature": 0.5
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=30)
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "analysis": result.get('result', {}).get('response', 'No analysis available'),
                    "query": query,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {
                    "error": f"AI analysis failed: {response.status_code}",
                    "details": response.text
                }
        except Exception as e:
            return {
                "error": f"AI analysis error: {str(e)}"
            }

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize data processor and AI analyzer
processor = ExecutiveDataProcessor()
ai_analyzer = CloudflareAIAnalyzer()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/kpis', methods=['GET'])
def get_kpis():
    """Get executive KPIs"""
    kpis = processor.get_executive_kpis()
    return jsonify(kpis)

@app.route('/api/data/<dataset>', methods=['POST'])
def get_filtered_data(dataset):
    """Get filtered dataset"""
    filters = request.json.get('filters', {})
    data = processor.get_filtered_data(dataset, filters)
    return jsonify({"data": data, "count": len(data)})

@app.route('/api/charts/<chart_type>', methods=['GET'])
def get_chart_data(chart_type):
    """Get chart data"""
    data = processor.get_chart_data(chart_type)
    return jsonify(data)

@app.route('/api/ai/analyze', methods=['POST'])
def ai_analyze():
    """AI-powered data analysis"""
    query = request.json.get('query', '')
    
    # Get current KPIs as context
    context = processor.get_executive_kpis()
    
    # Perform AI analysis
    result = ai_analyzer.analyze_data(query, context)
    return jsonify(result)

@app.route('/api/export/<format>', methods=['POST'])
def export_data(format):
    """Export data in various formats"""
    dataset = request.json.get('dataset', 'kpis')
    filters = request.json.get('filters', {})
    
    if format == 'csv':
        # Get data
        if dataset == 'kpis':
            data = [processor.get_executive_kpis()]
        else:
            data = processor.get_filtered_data(dataset, filters)
            
        # Convert to CSV
        df = pd.DataFrame(data)
        csv_data = df.to_csv(index=False)
        
        return csv_data, 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': f'attachment; filename={dataset}_{datetime.now().strftime("%Y%m%d")}.csv'
        }
    elif format == 'json':
        if dataset == 'kpis':
            data = processor.get_executive_kpis()
        else:
            data = processor.get_filtered_data(dataset, filters)
            
        return jsonify(data)
    else:
        return jsonify({"error": "Unsupported format"}), 400

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Get AI-generated insights"""
    insights = processor._generate_predictive_insights()
    return jsonify({"insights": insights})

if __name__ == '__main__':
    print("🚀 Red Cross Executive Analytics Engine Starting...")
    print("📊 Access the API at http://localhost:5000")
    print("🔗 Connect your frontend to this API for world-class analytics")
    app.run(debug=True, port=5000)