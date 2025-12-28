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
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error('Failed to get travel optimization');
      }
      
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      const result = JSON.parse(responseText);
      console.log('Raw API response:', result);
      
      // Parse the JSON response from the AI
      try {
        const recommendations = typeof result.recommendations === 'string' 
          ? JSON.parse(result.recommendations)
          : result.recommendations;
        console.log('Parsed recommendations:', recommendations);
        return recommendations;
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        console.log('Raw recommendations string:', result.recommendations);
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
      console.log('Sending ROI analysis request:', data);
      const response = await fetch(`${API_BASE}/api/analyze-roi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('ROI Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('ROI API error response:', errorText);
        throw new Error('Failed to get ROI analysis');
      }
      
      const responseText = await response.text();
      console.log('ROI Raw response text:', responseText);
      
      const result = JSON.parse(responseText);
      console.log('ROI Raw API response:', result);
      
      // Parse the JSON response from the AI
      try {
        const analysis = typeof result.analysis === 'string'
          ? JSON.parse(result.analysis)
          : result.analysis;
        console.log('ROI Parsed analysis:', analysis);
        return analysis;
      } catch (parseError) {
        console.error('Failed to parse ROI AI response:', parseError);
        console.log('ROI Raw analysis string:', result.analysis);
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
