export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes for AI features
    if (url.pathname.startsWith('/api/')) {
      return handleAPIRequest(request, env, url);
    }
    
    // Serve static assets using the new Assets binding
    try {
      // Try to fetch the asset
      const asset = await env.ASSETS.fetch(request);
      
      // If asset found, return it
      if (asset.status !== 404) {
        return asset;
      }
      
      // If not found and no file extension, serve index.html for SPA routing
      if (!url.pathname.includes('.')) {
        const indexRequest = new Request(`${url.origin}/index.html`, request);
        return await env.ASSETS.fetch(indexRequest);
      }
      
      return asset;
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
};

async function handleAPIRequest(request, env, url) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Route to appropriate AI handler
    if (url.pathname === '/api/optimize-travel') {
      return await handleTravelOptimization(request, env, corsHeaders);
    } else if (url.pathname === '/api/analyze-roi') {
      return await handleROIAnalysis(request, env, corsHeaders);
    } else if (url.pathname === '/api/strategic-insights') {
      return await handleStrategicInsights(request, env, corsHeaders);
    }
    
    return new Response('API endpoint not found', { status: 404, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// AI Feature 1: Intelligent T&E Planning
async function handleTravelOptimization(request, env, corsHeaders) {
  const data = await request.json();
  const { attendees, nights, location, budget, dates } = data;

  const prompt = `You are a travel planning expert. Analyze this team event:
- Attendees: ${attendees}
- Duration: ${nights} nights
- Preferred location: ${location || 'flexible'}
- Budget: $${budget || 'flexible'}
- Proposed dates: ${dates || 'flexible'}

Provide specific, actionable recommendations in JSON format:
{
  "optimalTiming": {
    "bestMonths": ["month1", "month2"],
    "reasoning": "explanation",
    "potentialSavings": "percentage"
  },
  "locationRecommendations": [
    {
      "city": "city name",
      "estimatedCostPerPerson": number,
      "pros": ["pro1", "pro2"],
      "cons": ["con1"]
    }
  ],
  "costOptimization": {
    "flightTips": "specific advice",
    "hotelTips": "specific advice",
    "estimatedTotal": number,
    "confidenceLevel": "high/medium/low"
  },
  "riskFactors": ["risk1", "risk2"]
}`;

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: 'You are a financial planning assistant specializing in travel optimization. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ]
  });

  return new Response(JSON.stringify({
    success: true,
    recommendations: response.response
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// AI Feature 2: ROI Calculator Enhancement
async function handleROIAnalysis(request, env, corsHeaders) {
  const data = await request.json();
  const { investment, timeSavings, qualityImprovements, efficiencyGains, context } = data;

  const prompt = `You are a financial analyst specializing in ROI calculations. Analyze this investment:

Investment Details:
- Total Investment: $${investment}
- Time Savings: ${timeSavings.hours} hours/month at $${timeSavings.hourlyRate}/hour
- Quality Improvements: ${qualityImprovements.defectReduction}% defect reduction, $${qualityImprovements.costPerDefect} per defect
- Efficiency Gains: ${efficiencyGains.processImprovement}% improvement, $${efficiencyGains.currentCost} current cost
- Context: ${context || 'Design operations initiative'}

Provide detailed analysis in JSON format:
{
  "roiAnalysis": {
    "totalAnnualBenefit": number,
    "netBenefit": number,
    "roiPercentage": number,
    "paybackMonths": number,
    "confidenceLevel": "high/medium/low"
  },
  "insights": [
    "key insight 1",
    "key insight 2",
    "key insight 3"
  ],
  "recommendations": [
    "actionable recommendation 1",
    "actionable recommendation 2"
  ],
  "riskFactors": [
    "potential risk 1",
    "potential risk 2"
  ],
  "benchmarks": {
    "industryAverage": "comparison to industry standards",
    "yourPosition": "where you stand"
  }
}`;

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: 'You are a financial ROI analyst. Always respond with valid JSON and specific numbers.' },
      { role: 'user', content: prompt }
    ]
  });

  return new Response(JSON.stringify({
    success: true,
    analysis: response.response
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// AI Feature 3: Strategic Budget Insights
async function handleStrategicInsights(request, env, corsHeaders) {
  const data = await request.json();
  const { budgetData, previousYear, question } = data;

  const prompt = `You are a strategic financial advisor for design operations teams. 

Current Budget Data:
${JSON.stringify(budgetData, null, 2)}

Previous Year:
${JSON.stringify(previousYear, null, 2)}

${question ? `User Question: ${question}` : 'Provide strategic insights'}

Analyze and provide strategic recommendations in JSON format:
{
  "executiveSummary": "2-3 sentence overview",
  "keyInsights": [
    {
      "category": "category name",
      "insight": "specific insight",
      "impact": "high/medium/low",
      "action": "recommended action"
    }
  ],
  "budgetHealth": {
    "score": "number 1-10",
    "status": "healthy/concerning/critical",
    "reasoning": "explanation"
  },
  "opportunities": [
    {
      "area": "area name",
      "potentialSavings": "amount or percentage",
      "effort": "low/medium/high",
      "recommendation": "specific action"
    }
  ],
  "warnings": [
    {
      "issue": "potential problem",
      "severity": "high/medium/low",
      "mitigation": "how to address"
    }
  ],
  "yearOverYearAnalysis": {
    "trend": "increasing/decreasing/stable",
    "majorChanges": ["change1", "change2"],
    "recommendation": "strategic advice"
  }
}`;

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: 'You are a strategic financial advisor. Always respond with valid JSON and actionable insights.' },
      { role: 'user', content: prompt }
    ]
  });

  return new Response(JSON.stringify({
    success: true,
    insights: response.response
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
