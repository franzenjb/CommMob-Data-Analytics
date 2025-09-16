// Data Service for CommMob Analytics
// Handles CSV data processing and API calls

class DataService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.cache = new Map();
  }

  // Fetch and parse CSV data
  async fetchCSVData(filename) {
    try {
      const response = await fetch(`/data/${filename}`);
      const csvText = await response.text();
      return this.parseCSV(csvText);
    } catch (error) {
      console.error(`Error fetching ${filename}:`, error);
      return [];
    }
  }

  // Parse CSV text into array of objects
  parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    }).filter(row => row[headers[0]]); // Remove empty rows
  }

  // Get volunteer data with caching
  async getVolunteerData() {
    if (this.cache.has('volunteers')) {
      return this.cache.get('volunteers');
    }

    const data = await this.fetchCSVData('Volunteer 2025.csv');
    this.cache.set('volunteers', data);
    return data;
  }

  // Get applicant data with caching
  async getApplicantData() {
    if (this.cache.has('applicants')) {
      return this.cache.get('applicants');
    }

    const data = await this.fetchCSVData('Applicants 2025.csv');
    this.cache.set('applicants', data);
    return data;
  }

  // Get dashboard metrics
  async getDashboardMetrics() {
    const [volunteers, applicants] = await Promise.all([
      this.getVolunteerData(),
      this.getApplicantData()
    ]);

    return {
      totalVolunteers: volunteers.length,
      totalApplicants: applicants.length,
      activeVolunteers: volunteers.filter(v => v['Current Status'] === 'General Volunteer').length,
      conversionRate: ((volunteers.length / applicants.length) * 100).toFixed(1),
      geographicCoverage: new Set(volunteers.map(v => v.State).filter(Boolean)).size,
      avgDaysToStart: this.calculateAverageDays(applicants, 'Days To Vol Start')
    };
  }

  // Calculate average days for a field
  calculateAverageDays(data, field) {
    const days = data
      .map(item => parseInt(item[field]))
      .filter(d => !isNaN(d) && d > 0);
    
    return days.length > 0 ? (days.reduce((a, b) => a + b, 0) / days.length).toFixed(1) : 0;
  }

  // Get geographic data for mapping
  async getGeographicData() {
    const volunteers = await this.getVolunteerData();
    
    return volunteers
      .filter(v => v.x && v.y && v.State)
      .map(v => ({
        id: v.ObjectId,
        name: v['Chapter Name'],
        state: v.State,
        status: v['Current Status'],
        position: v['Current Positions'],
        coordinates: [parseFloat(v.y), parseFloat(v.x)], // [lat, lng]
        zip: v.Zip,
        county: v['County of Residence']
      }));
  }

  // Get application pipeline data
  async getPipelineData() {
    const applicants = await this.getApplicantData();
    
    const pipeline = {
      total: applicants.length,
      pending: applicants.filter(a => a['Current Status'] === 'Inactive Prospective Volunteer').length,
      inProgress: applicants.filter(a => a['Current Status'] === 'General Volunteer' && !a['Vol Start Dt']).length,
      completed: applicants.filter(a => a['Current Status'] === 'General Volunteer' && a['Vol Start Dt']).length,
      bgcCompleted: applicants.filter(a => a['BGC Status'] === 'Completed').length,
      orientationCompleted: applicants.filter(a => a['Attend Orient. Step']).length
    };

    return {
      ...pipeline,
      bgcRate: ((pipeline.bgcCompleted / pipeline.total) * 100).toFixed(1),
      orientationRate: ((pipeline.orientationCompleted / pipeline.total) * 100).toFixed(1),
      conversionRate: ((pipeline.completed / pipeline.total) * 100).toFixed(1)
    };
  }

  // Get analytics data for charts
  async getAnalyticsData() {
    const [volunteers, applicants] = await Promise.all([
      this.getVolunteerData(),
      this.getApplicantData()
    ]);

    // Status distribution
    const statusDistribution = this.getStatusDistribution(volunteers);
    
    // Geographic distribution
    const geographicDistribution = this.getGeographicDistribution(volunteers);
    
    // Time series data
    const timeSeriesData = this.getTimeSeriesData(applicants);

    return {
      statusDistribution,
      geographicDistribution,
      timeSeriesData
    };
  }

  getStatusDistribution(volunteers) {
    const statusCounts = {};
    volunteers.forEach(v => {
      const status = v['Current Status'] || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return statusCounts;
  }

  getGeographicDistribution(volunteers) {
    const stateCounts = {};
    volunteers.forEach(v => {
      const state = v.State || 'Unknown';
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    });
    return stateCounts;
  }

  getTimeSeriesData(applicants) {
    const monthlyData = {};
    applicants.forEach(a => {
      if (a['Application Dt']) {
        const date = new Date(a['Application Dt']);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      }
    });
    return monthlyData;
  }

  // Search and filter functions
  async searchVolunteers(query, filters = {}) {
    const volunteers = await this.getVolunteerData();
    
    return volunteers.filter(v => {
      // Text search
      if (query) {
        const searchText = `${v['Chapter Name']} ${v.State} ${v['Current Status']} ${v['Current Positions']}`.toLowerCase();
        if (!searchText.includes(query.toLowerCase())) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (v['Current Status'] !== filters.status) return false;
      }

      // Region filter
      if (filters.region && filters.region !== 'all') {
        if (v.State !== filters.region) return false;
      }

      return true;
    });
  }

  async searchApplicants(query, filters = {}) {
    const applicants = await this.getApplicantData();
    
    return applicants.filter(a => {
      // Text search
      if (query) {
        const searchText = `${a.City} ${a.State} ${a['Current Status']} ${a['Workflow Type']}`.toLowerCase();
        if (!searchText.includes(query.toLowerCase())) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (a['Current Status'] !== filters.status) return false;
      }

      // Workflow filter
      if (filters.workflow && filters.workflow !== 'all') {
        if (a['Workflow Type'] !== filters.workflow) return false;
      }

      return true;
    });
  }
}

export default new DataService();
