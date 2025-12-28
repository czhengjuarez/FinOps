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

  const prompt = `Analyze this team event and provide concise recommendations:
- Attendees: ${attendees}
- Duration: ${nights} nights
- Location: ${location || 'flexible'}
- Budget: $${budget || 'flexible'}
- Dates: ${dates || 'flexible'}

Return ONLY valid JSON (no extra text):
{
  "optimalTiming": {
    "bestMonths": ["month1", "month2"],
    "reasoning": "brief explanation",
    "potentialSavings": "15%"
  },
  "locationRecommendations": [
    {
      "city": "city name",
      "estimatedCostPerPerson": 2000,
      "pros": ["pro1", "pro2"],
      "cons": ["con1"]
    }
  ],
  "costOptimization": {
    "flightTips": "brief tip",
    "hotelTips": "brief tip",
    "estimatedTotal": 20000
  }
}`;

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: 'You are a financial planning assistant specializing in travel optimization. Always respond with valid, complete JSON. Keep responses concise.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024
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
  const { investment, timeSavings, qualityImprovements, efficiencyGains, context, question } = data;

  const prompt = `Analyze this ROI investment and return ONLY valid JSON with calculated numeric values (no expressions):

Investment: $${investment}
Time Savings: ${timeSavings.hours} hrs/month × $${timeSavings.hourlyRate}/hr
Quality: ${qualityImprovements.defectReduction}% defect reduction × $${qualityImprovements.costPerDefect}/defect
Efficiency: ${efficiencyGains.processImprovement}% improvement on $${efficiencyGains.currentCost}
Context: ${context || 'Design operations'}
${question ? `Question: ${question}` : ''}

Return ONLY this JSON structure with CALCULATED NUMBERS (not math expressions):
{
  "roiAnalysis": {
    "totalAnnualBenefit": 500000,
    "netBenefit": 350000,
    "roiPercentage": 233,
    "paybackMonths": 5,
    "confidenceLevel": "high"
  },
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["rec 1", "rec 2"],
  "riskFactors": ["risk 1"],
  "benchmarks": {
    "industryAverage": "200-300% typical",
    "yourPosition": "above average"
  }
}`;

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: 'You are a financial ROI analyst. Always respond with valid, complete JSON. Keep responses concise.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024
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
      { role: 'system', content: 'You are a strategic financial advisor. Always respond with valid, complete JSON. Keep responses concise.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024
  });

  return new Response(JSON.stringify({
    success: true,
    insights: response.response
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
