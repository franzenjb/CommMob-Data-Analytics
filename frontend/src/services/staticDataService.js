// Static Data Service for GitHub Pages Deployment
// This provides data without requiring a backend server

class StaticDataService {
  constructor() {
    this.kpis = {
      timestamp: new Date().toISOString(),
      volunteer_metrics: {
        total_volunteers: 48978,
        total_applicants: 76324,
        conversion_rate: 25.4,
        active_volunteers: 22183,
        prospective_volunteers: 8185,
        youth_volunteers: 5157,
        monthly_new_applications: 2847,
        retention_rate: 60.7,
        average_time_to_activate: 8.2
      },
      financial_metrics: {
        total_raised: 180360000,
        total_donors: 10228,
        average_gift: 17634,
        median_gift: 8500,
        top_10_concentration: 35.2,
        donors_over_100k: 89,
        donors_over_1m: 10
      },
      operational_metrics: {
        total_blood_drives: 186066,
        drives_by_year: {
          "2022": { drives: 39705, total_collected: 842567, efficiency: 87.3 },
          "2023": { drives: 45892, total_collected: 976234, efficiency: 89.1 },
          "2024": { drives: 51234, total_collected: 1089456, efficiency: 91.2 },
          "2025": { drives: 49235, total_collected: 1047823, efficiency: 90.5 }
        },
        account_type_breakdown: {
          "Civic/Community": 46183,
          "Religious": 40627,
          "Education": 38011,
          "Business": 33104,
          "Healthcare": 15234,
          "Military": 12907
        },
        total_products_collected: 3956080,
        collection_efficiency: 89.5
      },
      geographic_metrics: {
        volunteer_distribution: {
          "TX": 10089,
          "CA": 7234,
          "NY": 5678,
          "FL": 4892,
          "PA": 3456,
          "OH": 3234,
          "IL": 2987,
          "MI": 2765,
          "NC": 2543,
          "GA": 2432
        },
        blood_drive_distribution: {
          "TX": 28456,
          "CA": 22345,
          "NY": 18234,
          "FL": 15678,
          "PA": 12345,
          "OH": 10234,
          "IL": 9876,
          "MI": 8765,
          "NC": 7654,
          "GA": 6543
        }
      },
      predictive_insights: [
        {
          type: "volunteer_growth",
          prediction: "Based on current trends, expecting 34,164 new applications in next 12 months",
          confidence: 0.75,
          recommendation: "Increase recruitment staff in high-growth regions (TX, CA, FL)"
        },
        {
          type: "operational_efficiency",
          prediction: "Blood collection efficiency trending upward - projected 92% by Q2 2025",
          confidence: 0.90,
          recommendation: "Focus on high-performing account types (Healthcare, Education)"
        },
        {
          type: "donor_diversification",
          prediction: "Major donor concentration risk identified",
          confidence: 0.85,
          recommendation: "Expand mid-level donor program to reduce dependency on top 10 donors"
        }
      ]
    };

    this.chartData = {
      volunteer_timeline: {
        labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                 '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'],
        datasets: [{
          label: "Monthly Applications",
          data: [2456, 2678, 2892, 3123, 3456, 3234, 2987, 3456, 3678, 3892, 4123, 4456]
        }]
      },
      geographic_heatmap: this.generateHeatmapData(),
      conversion_funnel: {
        stages: [
          { name: "Applied", value: 76324 },
          { name: "Processed", value: 65234 },
          { name: "Converted", value: 19397 },
          { name: "Active", value: 16234 }
        ]
      },
      blood_drive_trends: {
        labels: [2022, 2023, 2024, 2025],
        datasets: [
          {
            label: "Total Drives",
            data: [39705, 45892, 51234, 49235]
          },
          {
            label: "Products Collected",
            data: [842567, 976234, 1089456, 1047823],
            yAxisID: 'y2'
          }
        ]
      },
      donor_distribution: {
        labels: ['$5K-10K', '$10K-25K', '$25K-50K', '$50K-100K', '$100K-500K', '$500K-1M', '$1M+'],
        datasets: [{
          label: "Number of Donors",
          data: [5234, 2456, 1234, 987, 543, 234, 89]
        }]
      }
    };

    this.insights = [
      {
        type: "volunteer_growth",
        prediction: "Based on current trends, expecting 34,164 new applications in next 12 months",
        confidence: 0.75,
        recommendation: "Increase recruitment staff in high-growth regions"
      },
      {
        type: "retention_alert",
        prediction: "43% volunteer inactivation rate requires immediate attention",
        confidence: 0.92,
        recommendation: "Implement engagement program for at-risk volunteers"
      },
      {
        type: "geographic_opportunity",
        prediction: "Underserved regions identified in Southeast",
        confidence: 0.88,
        recommendation: "Expand operations in GA, SC, and AL markets"
      }
    ];
  }

  generateHeatmapData() {
    const points = [];
    // Generate realistic US coordinate clusters
    const clusters = [
      { lat: 29.7604, lng: -95.3698, count: 50 }, // Houston
      { lat: 33.7490, lng: -84.3880, count: 45 }, // Atlanta
      { lat: 40.7128, lng: -74.0060, count: 60 }, // NYC
      { lat: 34.0522, lng: -118.2437, count: 55 }, // LA
      { lat: 41.8781, lng: -87.6298, count: 40 }, // Chicago
      { lat: 39.9526, lng: -75.1652, count: 35 }, // Philadelphia
      { lat: 33.4484, lng: -112.0740, count: 38 }, // Phoenix
      { lat: 29.4241, lng: -98.4936, count: 42 }, // San Antonio
      { lat: 32.7767, lng: -96.7970, count: 48 }, // Dallas
      { lat: 42.3601, lng: -71.0589, count: 33 }, // Boston
    ];

    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        points.push({
          lat: cluster.lat + (Math.random() - 0.5) * 0.5,
          lng: cluster.lng + (Math.random() - 0.5) * 0.5,
          intensity: Math.random()
        });
      }
    });

    return points;
  }

  async getKPIs() {
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => resolve(this.kpis), 100);
    });
  }

  async getChartData(type) {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.chartData[type] || {}), 100);
    });
  }

  async getInsights() {
    return new Promise(resolve => {
      setTimeout(() => resolve({ insights: this.insights }), 100);
    });
  }

  async analyzeWithAI(query) {
    // Simulate AI response based on query content
    const responses = {
      default: "Based on the data analysis, I recommend focusing on volunteer retention in high-growth regions while expanding blood drive operations in underserved markets. The 25.4% conversion rate indicates room for improvement in the application process.",
      volunteer: "Volunteer conversion rate of 25.4% is below industry standard of 35%. Focus on streamlining the onboarding process and reducing time-to-activation from current 8.2 days to under 5 days. Texas and California show strongest growth potential.",
      financial: "Major donor concentration at 35.2% presents risk. Top 10 donors contribute $63.5M. Diversify by cultivating mid-level donors ($25K-$100K range) where we have only 2,221 donors with significant growth potential.",
      operational: "Blood drive efficiency at 89.5% is strong, exceeding target of 85%. Healthcare and Education partnerships show highest collection rates at 92% and 91% respectively. Recommend expanding these partnerships by 15% in Q1 2025.",
      regions: "Texas leads with 10,089 volunteers but shows 43% inactivation rate. California (7,234 volunteers) has better retention at 65%. Focus retention efforts on TX while scaling recruitment in CA, NY, and FL markets.",
      prediction: "Predictive models indicate 34,164 new applications expected in next 12 months based on current growth rate of 12% YoY. Prepare infrastructure for 8,500 successful conversions requiring training capacity expansion."
    };

    const lowerQuery = query.toLowerCase();
    let response = responses.default;
    
    if (lowerQuery.includes('volunteer')) response = responses.volunteer;
    else if (lowerQuery.includes('donor') || lowerQuery.includes('financial')) response = responses.financial;
    else if (lowerQuery.includes('blood') || lowerQuery.includes('operational')) response = responses.operational;
    else if (lowerQuery.includes('region') || lowerQuery.includes('state')) response = responses.regions;
    else if (lowerQuery.includes('predict') || lowerQuery.includes('forecast')) response = responses.prediction;

    return new Promise(resolve => {
      setTimeout(() => resolve({
        success: true,
        analysis: response,
        query: query,
        timestamp: new Date().toISOString()
      }), 500);
    });
  }

  async exportData(format, dataset) {
    const data = dataset === 'kpis' ? this.kpis : this.chartData;
    
    if (format === 'csv') {
      // Convert to CSV format
      const csv = this.convertToCSV(data);
      return new Promise(resolve => {
        setTimeout(() => resolve(csv), 100);
      });
    } else {
      return new Promise(resolve => {
        setTimeout(() => resolve(data), 100);
      });
    }
  }

  convertToCSV(data) {
    // Comprehensive CSV conversion
    const lines = ['Category,Metric,Value'];
    
    if (data.volunteer_metrics) {
      Object.entries(data.volunteer_metrics).forEach(([key, value]) => {
        lines.push(`Volunteer,${key.replace(/_/g, ' ')},${value}`);
      });
    }
    
    if (data.financial_metrics) {
      Object.entries(data.financial_metrics).forEach(([key, value]) => {
        lines.push(`Financial,${key.replace(/_/g, ' ')},${value}`);
      });
    }
    
    if (data.operational_metrics) {
      lines.push(`Operational,total blood drives,${data.operational_metrics.total_blood_drives}`);
      lines.push(`Operational,total products collected,${data.operational_metrics.total_products_collected}`);
      lines.push(`Operational,collection efficiency,${data.operational_metrics.collection_efficiency}%`);
    }
    
    return lines.join('\n');
  }
}

export default new StaticDataService();