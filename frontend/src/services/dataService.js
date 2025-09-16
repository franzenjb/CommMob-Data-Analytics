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
      // Try multiple paths to find the CSV files
      const possiblePaths = [
        `/data/${filename}`,
        `./data/${filename}`,
        `../data/${filename}`,
        `data/${filename}`
      ];
      
      let csvText = '';
      let lastError = null;
      
      for (const path of possiblePaths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            csvText = await response.text();
            break;
          }
        } catch (error) {
          lastError = error;
          continue;
        }
      }
      
      if (!csvText) {
        throw lastError || new Error(`Could not find ${filename} in any expected location`);
      }
      
      return this.parseCSV(csvText);
    } catch (error) {
      console.error(`Error fetching ${filename}:`, error);
      // Return mock data for development
      return this.getMockData(filename);
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

  // Get mock data for development when CSV files are not available
  getMockData(filename) {
    console.log(`Using mock data for ${filename}`);
    
    switch (filename) {
      case 'Volunteer 2025.csv':
        return [
          {
            ObjectId: '1',
            'Chapter Name': 'Austin Chapter',
            State: 'TX',
            'Current Status': 'General Volunteer',
            'Current Positions': 'Disaster Response',
            x: -97.7431,
            y: 30.2672,
            Zip: '78701',
            'County of Residence': 'Travis',
            'Vol Start Dt': '2024-01-15'
          },
          {
            ObjectId: '2',
            'Chapter Name': 'Las Vegas Chapter',
            State: 'NV',
            'Current Status': 'General Volunteer',
            'Current Positions': 'Blood Services',
            x: -115.1398,
            y: 36.1699,
            Zip: '89101',
            'County of Residence': 'Clark',
            'Vol Start Dt': '2024-02-20'
          },
          {
            ObjectId: '3',
            'Chapter Name': 'Salt Lake City Chapter',
            State: 'UT',
            'Current Status': 'General Volunteer',
            'Current Positions': 'Community Outreach',
            x: -111.8910,
            y: 40.7608,
            Zip: '84101',
            'County of Residence': 'Salt Lake',
            'Vol Start Dt': '2024-03-10'
          }
        ];
      
      case 'Applicants 2025.csv':
        return [
          {
            ObjectId: '1',
            City: 'Austin',
            State: 'TX',
            'Current Status': 'Inactive Prospective Volunteer',
            'Workflow Type': 'Standard',
            'Application Dt': '2024-01-01',
            'Days To Vol Start': '15',
            'BGC Status': 'Completed',
            'Attend Orient. Step': 'Yes'
          },
          {
            ObjectId: '2',
            City: 'Las Vegas',
            State: 'NV',
            'Current Status': 'General Volunteer',
            'Workflow Type': 'Fast Track',
            'Application Dt': '2024-02-01',
            'Days To Vol Start': '20',
            'BGC Status': 'Completed',
            'Attend Orient. Step': 'Yes'
          },
          {
            ObjectId: '3',
            City: 'Salt Lake City',
            State: 'UT',
            'Current Status': 'Inactive Prospective Volunteer',
            'Workflow Type': 'Standard',
            'Application Dt': '2024-03-01',
            'Days To Vol Start': '10',
            'BGC Status': 'Pending',
            'Attend Orient. Step': 'No'
          }
        ];
      
      case '>$5K donors past 12 months.csv':
        return [
          {
            'Gift $ ': '$7,500.00',
            X: -97.7431,
            Y: 30.2672
          },
          {
            'Gift $ ': '$12,000.00',
            X: -115.1398,
            Y: 36.1699
          },
          {
            'Gift $ ': '$25,000.00',
            X: -111.8910,
            Y: 40.7608
          }
        ];
      
      case 'Biomed.csv':
        return [
          {
            'Sponsor Ext ID': 'BIO001',
            'Account Name': 'Austin Blood Center',
            'Account Type': 'Blood Center',
            Status: 'Complete',
            Drives: '12',
            'RBC Products Collected': '450',
            'RBC Product Projection': '500',
            Lat: 30.2672,
            Long: -97.7431,
            Address: '123 Blood Drive St',
            City: 'Austin',
            St: 'TX',
            Zip: '78701',
            Year: '2024'
          },
          {
            'Sponsor Ext ID': 'BIO002',
            'Account Name': 'Las Vegas Community Center',
            'Account Type': 'Community Center',
            Status: 'Scheduled',
            Drives: '8',
            'RBC Products Collected': '320',
            'RBC Product Projection': '400',
            Lat: 36.1699,
            Long: -115.1398,
            Address: '456 Community Ave',
            City: 'Las Vegas',
            St: 'NV',
            Zip: '89101',
            Year: '2024'
          }
        ];
      
      default:
        return [];
    }
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

  // Get donors data with caching
  async getDonorsData() {
    if (this.cache.has('donors')) {
      return this.cache.get('donors');
    }

    const data = await this.fetchCSVData('>$5K donors past 12 months.csv');
    this.cache.set('donors', data);
    return data;
  }

  // Get biomed/blood drive data with caching
  async getBiomedData() {
    if (this.cache.has('biomed')) {
      return this.cache.get('biomed');
    }

    const data = await this.fetchCSVData('Biomed.csv');
    this.cache.set('biomed', data);
    return data;
  }

  // Get dashboard metrics
  async getDashboardMetrics() {
    const [volunteers, applicants, donors, biomed] = await Promise.all([
      this.getVolunteerData(),
      this.getApplicantData(),
      this.getDonorsData(),
      this.getBiomedData()
    ]);

    // Calculate donor metrics
    const totalDonations = donors.reduce((sum, donor) => {
      const amount = parseFloat(donor['Gift $ ']?.replace(/[$,]/g, '') || 0);
      return sum + amount;
    }, 0);

    // Calculate biomed metrics
    const totalBloodDrives = biomed.length;
    const totalProductsCollected = biomed.reduce((sum, drive) => {
      return sum + (parseInt(drive['RBC Products Collected']) || 0);
    }, 0);

    return {
      // Volunteer metrics
      totalVolunteers: volunteers.length,
      totalApplicants: applicants.length,
      activeVolunteers: volunteers.filter(v => v['Current Status'] === 'General Volunteer').length,
      conversionRate: ((volunteers.length / applicants.length) * 100).toFixed(1),
      geographicCoverage: new Set(volunteers.map(v => v.State).filter(Boolean)).size,
      avgDaysToStart: this.calculateAverageDays(applicants, 'Days To Vol Start'),
      
      // Donor metrics
      totalDonors: donors.length,
      totalDonations: totalDonations,
      avgDonationAmount: (totalDonations / donors.length).toFixed(2),
      topDonationAmount: Math.max(...donors.map(d => parseFloat(d['Gift $ ']?.replace(/[$,]/g, '') || 0))),
      
      // Biomed metrics
      totalBloodDrives: totalBloodDrives,
      totalProductsCollected: totalProductsCollected,
      avgProductsPerDrive: (totalProductsCollected / totalBloodDrives).toFixed(1),
      completedDrives: biomed.filter(d => d.Status === 'Complete').length
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

  // Get donors geographic data for mapping
  async getDonorsGeographicData() {
    const donors = await this.getDonorsData();
    
    return donors
      .filter(d => d.X && d.Y)
      .map(d => ({
        id: `donor-${Math.random()}`,
        giftAmount: parseFloat(d['Gift $ ']?.replace(/[$,]/g, '') || 0),
        coordinates: [parseFloat(d.Y), parseFloat(d.X)], // [lat, lng]
        formattedAmount: d['Gift $ ']
      }));
  }

  // Get blood drive geographic data for mapping
  async getBiomedGeographicData() {
    const biomed = await this.getBiomedData();
    
    return biomed
      .filter(b => b.Lat && b.Long)
      .map(b => ({
        id: b['Sponsor Ext ID'],
        accountName: b['Account Name'],
        accountType: b['Account Type'],
        status: b.Status,
        drives: parseInt(b.Drives) || 0,
        productsCollected: parseInt(b['RBC Products Collected']) || 0,
        productsProjected: parseInt(b['RBC Product Projection']) || 0,
        coordinates: [parseFloat(b.Lat), parseFloat(b.Long)], // [lat, lng]
        address: `${b.Address}, ${b.City}, ${b.St} ${b.Zip}`,
        year: b.Year
      }));
  }

  // Get donor analytics data
  async getDonorAnalytics() {
    const donors = await this.getDonorsData();
    
    // Gift amount distribution
    const giftAmounts = donors.map(d => parseFloat(d['Gift $ ']?.replace(/[$,]/g, '') || 0));
    const giftDistribution = {
      '5K-10K': giftAmounts.filter(a => a >= 5000 && a < 10000).length,
      '10K-25K': giftAmounts.filter(a => a >= 10000 && a < 25000).length,
      '25K-50K': giftAmounts.filter(a => a >= 25000 && a < 50000).length,
      '50K+': giftAmounts.filter(a => a >= 50000).length
    };

    return {
      giftDistribution,
      totalDonations: giftAmounts.reduce((sum, amount) => sum + amount, 0),
      averageGift: (giftAmounts.reduce((sum, amount) => sum + amount, 0) / giftAmounts.length).toFixed(2),
      topGift: Math.max(...giftAmounts)
    };
  }

  // Get biomed analytics data
  async getBiomedAnalytics() {
    const biomed = await this.getBiomedData();
    
    // Status distribution
    const statusDistribution = {};
    biomed.forEach(b => {
      const status = b.Status || 'Unknown';
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });

    // Account type distribution
    const accountTypeDistribution = {};
    biomed.forEach(b => {
      const type = b['Account Type'] || 'Unknown';
      accountTypeDistribution[type] = (accountTypeDistribution[type] || 0) + 1;
    });

    // Year distribution
    const yearDistribution = {};
    biomed.forEach(b => {
      const year = b.Year || 'Unknown';
      yearDistribution[year] = (yearDistribution[year] || 0) + 1;
    });

    return {
      statusDistribution,
      accountTypeDistribution,
      yearDistribution,
      totalProductsCollected: biomed.reduce((sum, b) => sum + (parseInt(b['RBC Products Collected']) || 0), 0),
      totalProductsProjected: biomed.reduce((sum, b) => sum + (parseInt(b['RBC Product Projection']) || 0), 0)
    };
  }

  // Search donors
  async searchDonors(query, filters = {}) {
    const donors = await this.getDonorsData();
    
    return donors.filter(d => {
      // Amount filter
      if (filters.minAmount) {
        const amount = parseFloat(d['Gift $ ']?.replace(/[$,]/g, '') || 0);
        if (amount < parseFloat(filters.minAmount)) return false;
      }

      if (filters.maxAmount) {
        const amount = parseFloat(d['Gift $ ']?.replace(/[$,]/g, '') || 0);
        if (amount > parseFloat(filters.maxAmount)) return false;
      }

      return true;
    });
  }

  // Search blood drives
  async searchBloodDrives(query, filters = {}) {
    const biomed = await this.getBiomedData();
    
    return biomed.filter(b => {
      // Text search
      if (query) {
        const searchText = `${b['Account Name']} ${b['Account Type']} ${b.City} ${b.St}`.toLowerCase();
        if (!searchText.includes(query.toLowerCase())) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (b.Status !== filters.status) return false;
      }

      // Account type filter
      if (filters.accountType && filters.accountType !== 'all') {
        if (b['Account Type'] !== filters.accountType) return false;
      }

      // Year filter
      if (filters.year && filters.year !== 'all') {
        if (b.Year !== filters.year) return false;
      }

      return true;
    });
  }
}

export default new DataService();
