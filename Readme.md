# Red Cross Executive Analytics Command Center

## World-Class Data Analytics Platform for Strategic Decision Making

### Live Platform

https://franzenjb.github.io/CommMob-Data-Analytics/

## Overview

A comprehensive, AI-powered analytics platform designed for American Red Cross executives to make data-driven decisions. This platform processes over 320,000 records across volunteer management, blood services, and donor operations, providing real-time insights through interactive visualizations and predictive analytics.

## Key Features

### Executive Dashboard
- **Real-time KPI Metrics**: Track volunteer conversion rates, financial performance, and operational efficiency
- **Predictive Analytics**: AI-powered forecasting for volunteer retention and resource optimization
- **Natural Language Queries**: Ask questions about your data in plain English
- **Export Capabilities**: Generate reports in CSV and JSON formats

### Data Visualization
- **Interactive Maps**: Leaflet-based geographic visualization of volunteers, donors, and blood drives
- **Dynamic Charts**: Plotly.js powered analytics including:
  - Volunteer application trends
  - Conversion funnels
  - Blood drive performance metrics
  - Donor distribution analysis
- **Heatmaps**: Density visualization for resource optimization

### AI-Powered Insights
- **Cloudflare AI Integration**: Advanced analytics using LLM technology
- **Predictive Modeling**: Early warning systems for volunteer attrition
- **Recommendation Engine**: Strategic suggestions based on data patterns
- **Automated Analysis**: Natural language processing for data queries

## Data Sources

The platform analyzes four critical datasets:

1. **Applicants 2025.csv** (76,324 records)
   - Volunteer application pipeline
   - Conversion metrics
   - Geographic distribution

2. **Volunteer 2025.csv** (48,978 records)
   - Active volunteer management
   - Service area allocation
   - Engagement tracking

3. **Biomed.csv** (186,066 records)
   - Blood drive operations
   - Collection efficiency
   - Partner organization data

4. **Major Donors** (10,228 records)
   - Gift size analysis
   - Geographic wealth mapping
   - Revenue concentration metrics

## Technology Stack

### Frontend
- **React.js**: Modern UI framework
- **Material-UI**: Professional component library
- **Leaflet**: Interactive mapping
- **Plotly.js**: Advanced charting
- **Axios**: API communication

### Backend
- **Python Flask**: RESTful API server
- **Pandas**: Data processing engine
- **NumPy**: Numerical computations
- **Cloudflare AI**: LLM integration

### Deployment
- **GitHub Pages**: Static site hosting
- **GitHub Actions**: CI/CD pipeline
- **Docker**: Container support (optional)

## Getting Started

### Prerequisites
```bash
# Required
Node.js 16+
Python 3.8+
Git

# Optional (for AI features)
Cloudflare API Token
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/franzenjb/CommMob-Data-Analytics.git
cd CommMob-Data-Analytics
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Configure Cloudflare AI (optional):
```bash
# Edit backend/.env
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

4. Start the backend server:
```bash
python executive_analytics_engine.py
# API runs on http://localhost:5000
```

5. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

6. Start development server:
```bash
npm start
# App runs on http://localhost:3000
```

## API Endpoints

### Core Endpoints
- `GET /api/health` - System health check
- `GET /api/kpis` - Executive KPI metrics
- `POST /api/data/<dataset>` - Filtered data retrieval
- `GET /api/charts/<type>` - Chart data generation
- `POST /api/ai/analyze` - Natural language analysis
- `GET /api/insights` - Predictive insights
- `POST /api/export/<format>` - Data export (CSV/JSON)

## Key Metrics & KPIs

### Volunteer Pipeline
- **Conversion Rate**: 25.4% applicant-to-volunteer
- **Retention Risk**: 16.4% later become inactive
- **Average Activation**: Days from application to start
- **Geographic Coverage**: State-level distribution

### Financial Performance
- **Total Raised**: $180.36M from major donors
- **Average Gift**: $17,634
- **Donor Concentration**: Top 10 analysis
- **Growth Trends**: Year-over-year metrics

### Operational Efficiency
- **Blood Drives**: 186,066 total events
- **Collection Rate**: Projected vs. actual analysis
- **Partner Distribution**: By account type
- **Geographic Optimization**: Drive location planning

## Executive Insights

The platform provides strategic recommendations including:

1. **Volunteer Optimization**
   - Improve 43% inactivation rate
   - Accelerate time-to-value metrics
   - Geographic expansion strategies

2. **Financial Growth**
   - Major gift program expansion
   - Donor diversification initiatives
   - Revenue concentration analysis

3. **Operational Excellence**
   - Blood drive efficiency improvements
   - Resource allocation optimization
   - Predictive capacity planning

## Security & Privacy

- All repositories are private
- API keys stored in environment variables
- No sensitive data in version control
- CORS configured for production domains

## Performance

- **Data Processing**: <2 seconds for 320,000 records
- **Chart Generation**: Real-time rendering
- **Map Visualization**: Optimized for 10,000+ markers
- **API Response**: <500ms average latency

## Browser Support

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/enhancement`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/enhancement`
5. Open Pull Request

## Support

- **Issues**: GitHub Issues for bug reports
- **Documentation**: See `/docs` folder
- **Contact**: Development team

## License

MIT License - See LICENSE file

## Acknowledgments

- American Red Cross for data and requirements
- Cloudflare for AI infrastructure
- Open source community for libraries

---

## Executive Summary

This platform transforms Red Cross data into actionable intelligence, enabling executives to:
- Make data-driven strategic decisions
- Predict and prevent operational challenges
- Optimize resource allocation
- Improve volunteer retention
- Maximize fundraising efficiency

**Access the live platform**: https://franzenjb.github.io/CommMob-Data-Analytics/

---

*Built with excellence for the American Red Cross mission*