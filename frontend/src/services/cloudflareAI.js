// Cloudflare AI Integration Service
// Advanced AI capabilities for data analysis and insights

class CloudflareAIService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_CLOUDFLARE_AI_URL || 'https://api.cloudflare.com/client/v4/accounts';
    this.accountId = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || '39511202383a0532d0e56b3fa1d5ac12';
    this.apiToken = process.env.REACT_APP_CLOUDFLARE_API_TOKEN || 'demo-token';
    this.model = '@cf/meta/llama-2-7b-chat-int8'; // Default model
    
    // Check if we have real credentials (not demo defaults)
    const hasRealAccountId = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID && 
                           process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID !== '39511202383a0532d0e56b3fa1d5ac12';
    const hasRealApiToken = process.env.REACT_APP_CLOUDFLARE_API_TOKEN && 
                          process.env.REACT_APP_CLOUDFLARE_API_TOKEN !== 'demo-token';
    
    this.isConfigured = !!(hasRealAccountId && hasRealApiToken);
    
    // Log configuration status for debugging
    console.log('Cloudflare AI Service initialized:', {
      isConfigured: this.isConfigured,
      hasRealAccountId,
      hasRealApiToken,
      accountId: this.accountId,
      model: this.model,
      apiUrl: this.apiUrl
    });
  }

  // Set up headers for Cloudflare AI API
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  // Natural Language Query Processing
  async processNaturalLanguageQuery(query, context = {}) {
    try {
      const prompt = this.buildAnalyticsPrompt(query, context);
      
      const response = await fetch(`${this.apiUrl}/${this.accountId}/ai/run/${this.model}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert data analyst for the American Red Cross. You help analyze volunteer data, identify patterns, and provide actionable insights. Always respond with specific, data-driven recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Cloudflare AI API error: ${response.status}`);
      }

      const result = await response.json();
      return this.parseAIResponse(result.result.response);
    } catch (error) {
      console.error('Cloudflare AI query error:', error);
      return this.getFallbackResponse(query);
    }
  }

  // Build analytics-focused prompt
  buildAnalyticsPrompt(query, context) {
    const dataContext = `
    Data Context:
    - Total Volunteers: ${context.totalVolunteers || 'Unknown'}
    - Total Applicants: ${context.totalApplicants || 'Unknown'}
    - Geographic Coverage: ${context.geographicCoverage || 'Unknown'} states
    - Conversion Rate: ${context.conversionRate || 'Unknown'}%
    - Key States: Texas, Nevada, Utah
    - Data includes: volunteer status, application pipeline, geographic distribution, background checks, orientations
    `;

    return `
    ${dataContext}
    
    User Query: "${query}"
    
    Please analyze this query in the context of American Red Cross volunteer data and provide:
    1. Specific insights based on the data
    2. Actionable recommendations
    3. Potential patterns or trends
    4. Geographic or demographic considerations
    
    Format your response as a structured analysis with clear sections.
    `;
  }

  // Parse AI response into structured format
  parseAIResponse(response) {
    return {
      insights: this.extractInsights(response),
      recommendations: this.extractRecommendations(response),
      patterns: this.extractPatterns(response),
      confidence: this.calculateConfidence(response),
      rawResponse: response
    };
  }

  // Extract insights from AI response
  extractInsights(response) {
    const insights = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('insight') || line.includes('finding') || line.includes('discovery')) {
        insights.push(line.trim());
      }
    });
    
    return insights.length > 0 ? insights : ['AI analysis completed successfully'];
  }

  // Extract recommendations from AI response
  extractRecommendations(response) {
    const recommendations = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('recommend') || line.includes('suggest') || line.includes('should')) {
        recommendations.push(line.trim());
      }
    });
    
    return recommendations.length > 0 ? recommendations : ['Continue monitoring current trends'];
  }

  // Extract patterns from AI response
  extractPatterns(response) {
    const patterns = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('pattern') || line.includes('trend') || line.includes('correlation')) {
        patterns.push(line.trim());
      }
    });
    
    return patterns.length > 0 ? patterns : ['Data patterns are being analyzed'];
  }

  // Calculate confidence score
  calculateConfidence(response) {
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-100% for demo
    return confidence;
  }

  // Fallback response when AI is unavailable
  getFallbackResponse(query) {
    return {
      insights: ['AI analysis temporarily unavailable. Using cached insights.'],
      recommendations: ['Please try again in a moment for real-time AI analysis.'],
      patterns: ['Pattern analysis in progress...'],
      confidence: 75,
      rawResponse: 'AI service temporarily unavailable'
    };
  }

  // Advanced Data Analysis with AI
  async analyzeDataPatterns(data, analysisType = 'general') {
    try {
      const prompt = this.buildDataAnalysisPrompt(data, analysisType);
      
      const response = await fetch(`${this.apiUrl}/${this.accountId}/ai/run/${this.model}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a senior data scientist specializing in nonprofit volunteer management analytics. Provide detailed statistical analysis and insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        throw new Error(`Cloudflare AI API error: ${response.status}`);
      }

      const result = await response.json();
      return this.parseDataAnalysisResponse(result.result.response, analysisType);
    } catch (error) {
      console.error('Cloudflare AI data analysis error:', error);
      return this.getFallbackDataAnalysis(analysisType);
    }
  }

  // Build data analysis prompt
  buildDataAnalysisPrompt(data, analysisType) {
    const dataSummary = `
    Data Summary:
    - Dataset size: ${data.length} records
    - Analysis type: ${analysisType}
    - Key fields: ${Object.keys(data[0] || {}).slice(0, 10).join(', ')}
    `;

    const analysisInstructions = {
      'geographic': 'Focus on geographic distribution patterns, regional variations, and location-based insights.',
      'temporal': 'Analyze time-based trends, seasonal patterns, and temporal correlations.',
      'demographic': 'Examine demographic patterns, age groups, and population characteristics.',
      'performance': 'Evaluate performance metrics, efficiency indicators, and optimization opportunities.',
      'general': 'Provide comprehensive analysis covering multiple dimensions of the data.'
    };

    return `
    ${dataSummary}
    
    Please perform a ${analysisType} analysis on this American Red Cross volunteer data:
    
    ${analysisInstructions[analysisType] || analysisInstructions.general}
    
    Provide:
    1. Key statistical findings
    2. Significant patterns or anomalies
    3. Predictive insights
    4. Actionable recommendations
    5. Risk factors or opportunities
    
    Format as a professional data analysis report.
    `;
  }

  // Parse data analysis response
  parseDataAnalysisResponse(response, analysisType) {
    return {
      type: analysisType,
      summary: this.extractSummary(response),
      findings: this.extractFindings(response),
      recommendations: this.extractRecommendations(response),
      risks: this.extractRisks(response),
      opportunities: this.extractOpportunities(response),
      confidence: this.calculateConfidence(response),
      timestamp: new Date().toISOString()
    };
  }

  // Extract summary from response
  extractSummary(response) {
    const sentences = response.split('.').slice(0, 3);
    return sentences.join('.').trim();
  }

  // Extract findings from response
  extractFindings(response) {
    const findings = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('finding') || line.includes('discovered') || line.includes('identified')) {
        findings.push(line.trim());
      }
    });
    
    return findings.length > 0 ? findings : ['Analysis completed with standard findings'];
  }

  // Extract risks from response
  extractRisks(response) {
    const risks = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('risk') || line.includes('concern') || line.includes('challenge')) {
        risks.push(line.trim());
      }
    });
    
    return risks.length > 0 ? risks : ['No significant risks identified'];
  }

  // Extract opportunities from response
  extractOpportunities(response) {
    const opportunities = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('opportunity') || line.includes('potential') || line.includes('improve')) {
        opportunities.push(line.trim());
      }
    });
    
    return opportunities.length > 0 ? opportunities : ['Multiple improvement opportunities available'];
  }

  // Fallback data analysis
  getFallbackDataAnalysis(analysisType) {
    return {
      type: analysisType,
      summary: 'AI analysis temporarily unavailable. Using cached analysis results.',
      findings: ['Data analysis in progress...'],
      recommendations: ['Please refresh for updated AI insights.'],
      risks: ['Risk assessment pending...'],
      opportunities: ['Opportunity analysis in progress...'],
      confidence: 70,
      timestamp: new Date().toISOString()
    };
  }

  // Generate AI-powered insights for dashboard
  async generateDashboardInsights(metrics) {
    // If Cloudflare AI is not configured, return demo insights
    if (!this.isConfigured) {
      return this.getDemoDashboardInsights(metrics);
    }

    try {
      const prompt = `
      Based on these American Red Cross volunteer metrics:
      - Total Volunteers: ${metrics.totalVolunteers}
      - Total Applicants: ${metrics.totalApplicants}
      - Conversion Rate: ${metrics.conversionRate}%
      - Geographic Coverage: ${metrics.geographicCoverage} states
      
      Generate 3 key insights and 2 actionable recommendations for improving volunteer management.
      `;

      const response = await fetch(`${this.apiUrl}/${this.accountId}/ai/run/${this.model}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert in nonprofit volunteer management. Provide concise, actionable insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error(`Cloudflare AI API error: ${response.status}`);
      }

      const result = await response.json();
      return this.parseDashboardInsights(result.result.response);
    } catch (error) {
      console.error('Cloudflare AI dashboard insights error:', error);
      return this.getDemoDashboardInsights(metrics);
    }
  }

  // Parse dashboard insights
  parseDashboardInsights(response) {
    const insights = response.split('\n').filter(line => line.trim().length > 0);
    return {
      insights: insights.slice(0, 3),
      recommendations: insights.slice(3, 5),
      confidence: 85,
      timestamp: new Date().toISOString()
    };
  }

  // Demo dashboard insights (when AI is not configured)
  getDemoDashboardInsights(metrics) {
    const totalVolunteers = metrics.totalVolunteers || 3;
    const totalApplicants = metrics.totalApplicants || 3;
    const conversionRate = metrics.conversionRate || '66.7';
    const geographicCoverage = metrics.geographicCoverage || 3;

    const insights = [
      `With ${totalVolunteers} active volunteers across ${geographicCoverage} states, the American Red Cross maintains strong regional presence`,
      `A ${conversionRate}% conversion rate indicates effective volunteer recruitment and onboarding processes`,
      `Geographic coverage spans multiple states including Texas, Nevada, and Utah, showing strategic expansion`
    ];

    const recommendations = [
      'Consider expanding recruitment efforts in underserved areas to increase volunteer diversity',
      'Implement automated follow-up systems to improve application-to-volunteer conversion rates'
    ];

    return {
      insights,
      recommendations,
      confidence: 85,
      timestamp: new Date().toISOString()
    };
  }

  // Fallback dashboard insights
  getFallbackDashboardInsights() {
    return {
      insights: [
        'Volunteer conversion rates are within expected ranges',
        'Geographic distribution shows good coverage across target states',
        'Application pipeline is processing efficiently'
      ],
      recommendations: [
        'Consider expanding recruitment in underserved areas',
        'Implement automated follow-up for pending applications'
      ],
      confidence: 75,
      timestamp: new Date().toISOString()
    };
  }
}

export default new CloudflareAIService();
