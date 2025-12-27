// Test script for AI endpoints
const API_BASE = 'http://localhost:8787';

async function testTravelOptimizer() {
  console.log('\n🛫 Testing Travel Optimizer...');
  try {
    const response = await fetch(`${API_BASE}/api/optimize-travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attendees: 15,
        nights: 3,
        location: 'San Francisco',
        budget: 45000,
        dates: 'March 2025'
      })
    });
    
    const result = await response.json();
    console.log('✅ Travel Optimizer Response:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Travel Optimizer Error:', error.message);
    return false;
  }
}

async function testROIAnalyzer() {
  console.log('\n📊 Testing ROI Analyzer...');
  try {
    const response = await fetch(`${API_BASE}/api/analyze-roi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        investment: 50000,
        timeSavings: {
          hours: 200,
          hourlyRate: 100
        },
        qualityImprovements: {
          defectReduction: 30,
          costPerDefect: 500
        },
        efficiencyGains: {
          processImprovement: 25,
          currentCost: 80000
        },
        context: 'Design system implementation'
      })
    });
    
    const result = await response.json();
    console.log('✅ ROI Analyzer Response:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error('❌ ROI Analyzer Error:', error.message);
    return false;
  }
}

async function testStrategicInsights() {
  console.log('\n🧠 Testing Strategic Insights...');
  try {
    const response = await fetch(`${API_BASE}/api/strategic-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        budgetData: {
          headcount: { count: 65, avgSalary: 120000, benefitsRate: 0.28 },
          tne: { total: 84375 },
          vendors: { total: 87000 },
          consultants: { total: 75000 }
        },
        previousYear: {
          headcount: 2604000,
          tne: 84375,
          vendors: 87000,
          consultants: 75000
        },
        question: 'What are my biggest cost savings opportunities?'
      })
    });
    
    const result = await response.json();
    console.log('✅ Strategic Insights Response:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Strategic Insights Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting AI Endpoint Tests...\n');
  console.log('API Base:', API_BASE);
  
  const results = {
    travelOptimizer: await testTravelOptimizer(),
    roiAnalyzer: await testROIAnalyzer(),
    strategicInsights: await testStrategicInsights()
  };
  
  console.log('\n📋 Test Summary:');
  console.log('─────────────────────────────────');
  console.log(`Travel Optimizer:    ${results.travelOptimizer ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`ROI Analyzer:        ${results.roiAnalyzer ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Strategic Insights:  ${results.strategicInsights ? '✅ PASS' : '❌ FAIL'}`);
  console.log('─────────────────────────────────');
  
  const allPassed = Object.values(results).every(r => r);
  console.log(`\n${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`);
  
  process.exit(allPassed ? 0 : 1);
}

runTests();
