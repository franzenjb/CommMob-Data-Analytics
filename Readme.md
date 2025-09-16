# CommMob Data Analytics Platform

A comprehensive, multi-layered data analytics platform for American Red Cross volunteer management, disaster response, and organizational insights. This platform enables users to study volunteer and applicant data from every possible angle through interactive maps, advanced visualizations, and AI-powered analytics.

## 🎯 Project Vision

Transform American Red Cross data into actionable insights through:
- **Interactive Mapping**: Leaflet and Plotly maps for geographic analysis
- **Advanced Visualizations**: Charts, diagrams, and dynamic filters
- **AI-Powered Analytics**: Natural language querying and intelligent insights
- **Multi-Layer Data**: Volunteers, applicants, home fires, demographics, and more
- **Real-Time Analysis**: Live data processing and visualization

## 📊 Current Data Layers

### Primary Datasets
- **Applicants 2025.csv** (76,000+ records)
  - Application pipeline tracking
  - Background check status and scores
  - Geographic coordinates (x,y)
  - Workflow types and outcomes
  - Time-based metrics (days to start, inactive, etc.)

- **Volunteer 2025.csv** (49,000+ records)
  - Active volunteer positions and status
  - Service areas and job types
  - Hours tracking and activity
  - Geographic distribution
  - Language capabilities

### Planned Data Layers
- **Home Fires Data**: Disaster response tracking
- **Demographics**: Population and community data
- **Disaster Response**: Emergency event data
- **Resource Allocation**: Equipment and supply tracking
- **Performance Metrics**: Response times and outcomes

## 🛠️ Recommended Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **Leaflet** - Interactive mapping
- **Plotly.js** - Advanced charts and graphs
- **D3.js** - Custom visualizations
- **Material-UI** - Professional UI components
- **React Query** - Data fetching and caching

### Backend
- **Python Flask/FastAPI** - API development
- **Pandas** - Data processing and analysis
- **GeoPandas** - Geographic data handling
- **SQLAlchemy** - Database ORM
- **PostgreSQL/PostGIS** - Spatial database

### AI & Analytics
- **OpenAI API** - Natural language processing
- **Anthropic Claude API** - Advanced AI analysis
- **scikit-learn** - Machine learning models
- **Jupyter Notebooks** - Data exploration

### Infrastructure
- **Docker** - Containerization
- **Vercel** - Frontend deployment
- **PythonAnywhere** - Backend hosting
- **GitHub Actions** - CI/CD pipeline

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
```bash
# Project Setup
mkdir CommMob-Data-Analytics
cd CommMob-Data-Analytics
git init
npm init -y
```

1. **Backend API Setup**
   - Flask/FastAPI server
   - CSV data ingestion
   - Basic CRUD endpoints
   - Geographic data processing

2. **Frontend Foundation**
   - React app with routing
   - Basic dashboard layout
   - Data table components

### Phase 2: Core Visualizations (Weeks 3-4)
1. **Interactive Maps**
   - Leaflet integration
   - Volunteer location mapping
   - Heat maps for density
   - Clickable markers with details

2. **Chart Library**
   - Plotly integration
   - Time series analysis
   - Status distribution charts
   - Geographic breakdowns

### Phase 3: Advanced Features (Weeks 5-6)
1. **Filtering System**
   - Multi-dimensional filters
   - Real-time data updates
   - Saved filter presets
   - Export capabilities

2. **AI Analytics Engine**
   - Natural language querying
   - Automated insights generation
   - Trend analysis
   - Predictive modeling

### Phase 4: Data Expansion (Weeks 7-8)
1. **Additional Data Sources**
   - Home fires data integration
   - Demographics overlay
   - Disaster response tracking
   - Performance metrics

2. **Advanced Analytics**
   - Correlation analysis
   - Geographic clustering
   - Time-based patterns
   - Resource optimization

## 🔧 Quick Start Guide

### Prerequisites
- Node.js 16+
- Python 3.8+
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/CommMob-Data-Analytics.git
cd CommMob-Data-Analytics

# Backend setup
cd backend
pip install -r requirements.txt
python app.py

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

### View Application
```bash
# Open in browser
open http://localhost:3000
```

## 📈 Key Features

### Interactive Mapping
- **Leaflet Maps**: Zoom, pan, and explore volunteer locations
- **Heat Maps**: Visualize volunteer density and activity
- **Layer Controls**: Toggle different data layers
- **Popup Details**: Click markers for detailed information

### Advanced Visualizations
- **Plotly Charts**: Interactive time series and distribution charts
- **D3.js Graphics**: Custom network diagrams and flow charts
- **Real-time Updates**: Live data refresh and filtering
- **Export Options**: PNG, PDF, and CSV export capabilities

### AI-Powered Analytics
- **Natural Language Queries**: "Show me volunteers in Texas who started in Q1"
- **Automated Insights**: AI-generated trend analysis and recommendations
- **Predictive Modeling**: Forecast volunteer needs and response patterns
- **Smart Filtering**: AI-suggested filter combinations

### Multi-Dimensional Analysis
- **Geographic**: State, county, city, and coordinate-based analysis
- **Temporal**: Time-based trends and seasonal patterns
- **Demographic**: Age, language, and background analysis
- **Operational**: Status, workflow, and performance metrics

## 🎨 Sample Visualizations

### Maps
- Volunteer distribution heat map
- Application success rate by region
- Background check completion rates
- Time-to-volunteer geographic analysis

### Charts
- Application pipeline funnel
- Volunteer status distribution
- Monthly recruitment trends
- Geographic coverage analysis

### AI Insights
- "Which regions have the highest volunteer retention?"
- "What factors predict successful volunteer conversion?"
- "Where should we focus recruitment efforts?"
- "How do disaster events affect volunteer applications?"

## 🔄 Data Pipeline

1. **Ingestion**: CSV files → Database
2. **Processing**: Data cleaning and enrichment
3. **Analysis**: Statistical and geographic processing
4. **Visualization**: Interactive charts and maps
5. **AI Enhancement**: Natural language insights
6. **Export**: Reports and data downloads

## 🚀 Deployment

### Development
```bash
# Start development servers
npm run dev          # Frontend
python app.py        # Backend
```

### Production
```bash
# Build and deploy
npm run build
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an issue for bugs or feature requests
- Check documentation in `/docs` folder
- Contact development team for questions

---

## 🚀 Live Platform

**Your CommMob Data Analytics platform is now live!**

🌐 **Live URL**: https://franzenjb.github.io/CommMob-Data-Analytics

📊 **GitHub Repository**: https://github.com/franzenjb/CommMob-Data-Analytics

### What's Deployed
- ✅ Professional American Red Cross branded UI
- ✅ Economist-quality design system
- ✅ Complete dashboard with metric cards
- ✅ Interactive navigation and responsive layout
- ✅ Ready for data integration and mapping features

### Next Steps
1. **Data Integration**: Connect to your CSV data files
2. **Mapping Features**: Implement Leaflet interactive maps
3. **Chart Integration**: Add Plotly.js visualizations
4. **AI Features**: Connect to AI analysis endpoints
5. **Backend API**: Build Python backend for data processing

The platform will evolve into a comprehensive analytics powerhouse for American Red Cross operations.
