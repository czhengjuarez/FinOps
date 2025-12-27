const API_BASE = window.location.origin;

export const aiService = {
  async optimizeTravel(data) {
    try {
      const response = await fetch(`${API_BASE}/api/optimize-travel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get travel optimization');
      }
      
      const result = await response.json();
      
      // Parse the JSON response from the AI
      try {
        const recommendations = typeof result.recommendations === 'string' 
          ? JSON.parse(result.recommendations)
          : result.recommendations;
        return recommendations;
      } catch {
        // If parsing fails, return the raw response
        return result.recommendations;
      }
    } catch (error) {
      console.error('AI Travel Optimization Error:', error);
      throw error;
    }
  },

  async analyzeROI(data) {
    try {
      const response = await fetch(`${API_BASE}/api/analyze-roi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get ROI analysis');
      }
      
      const result = await response.json();
      
      // Parse the JSON response from the AI
      try {
        const analysis = typeof result.analysis === 'string'
          ? JSON.parse(result.analysis)
          : result.analysis;
        return analysis;
      } catch (e) {
        return result.analysis;
      }
    } catch (error) {
      console.error('AI ROI Analysis Error:', error);
      throw error;
    }
  },

  async getStrategicInsights(data) {
    try {
      const response = await fetch(`${API_BASE}/api/strategic-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get strategic insights');
      }
      
      const result = await response.json();
      
      // Parse the JSON response from the AI
      try {
        const insights = typeof result.insights === 'string'
          ? JSON.parse(result.insights)
          : result.insights;
        return insights;
      } catch {
        return result.insights;
      }
    } catch (error) {
      console.error('AI Strategic Insights Error:', error);
      throw error;
    }
  }
};
