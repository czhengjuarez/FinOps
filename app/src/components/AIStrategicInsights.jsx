import { useState } from 'react';
import { Sparkles, Loader2, Brain, Target, AlertCircle, TrendingUp } from 'lucide-react';
import { aiService } from '../utils/aiService';

const AIStrategicInsights = ({ budgetData, previousYear }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');

  const getInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = {
        budgetData,
        previousYear,
        question: question.trim() || undefined
      };
      
      const result = await aiService.getStrategicInsights(data);
      setInsights(result);
    } catch (err) {
      setError('Failed to get strategic insights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-indigo-200 dark:border-indigo-900 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Strategic Advisor</h3>
        <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">BETA</span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Get AI-powered strategic insights about your budget, including opportunities for savings, risk areas, and year-over-year analysis.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ask a specific question (optional)
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., Where can I save money? What are my biggest risks?"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <button
        onClick={getInsights}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Get Strategic Insights
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {insights && (
        <div className="mt-6 space-y-4">
          {/* Executive Summary */}
          {insights.executiveSummary && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-indigo-500">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Executive Summary</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{insights.executiveSummary}</p>
            </div>
          )}

          {/* Budget Health */}
          {insights.budgetHealth && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Budget Health Score</h4>
                <span className={`text-2xl font-bold ${
                  insights.budgetHealth.status === 'healthy' ? 'text-green-600' :
                  insights.budgetHealth.status === 'concerning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {insights.budgetHealth.score}/10
                </span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                insights.budgetHealth.status === 'healthy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                insights.budgetHealth.status === 'concerning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {insights.budgetHealth.status.toUpperCase()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{insights.budgetHealth.reasoning}</p>
            </div>
          )}

          {/* Key Insights */}
          {insights.keyInsights && insights.keyInsights.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Key Insights</h4>
              </div>
              <div className="space-y-3">
                {insights.keyInsights.map((insight, idx) => (
                  <div key={idx} className="border-l-4 border-indigo-500 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">{insight.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{insight.insight}</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      → {insight.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {insights.opportunities && insights.opportunities.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">💰 Cost Savings Opportunities</h4>
              <div className="space-y-3">
                {insights.opportunities.map((opp, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">{opp.area}</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {opp.potentialSavings}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{opp.recommendation}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      opp.effort === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      opp.effort === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {opp.effort} effort
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {insights.warnings && insights.warnings.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Warnings & Risks</h4>
              </div>
              <div className="space-y-2">
                {insights.warnings.map((warning, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">{warning.issue}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        warning.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        warning.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {warning.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Mitigation:</strong> {warning.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Year-over-Year Analysis */}
          {insights.yearOverYearAnalysis && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Year-over-Year Analysis</h4>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                insights.yearOverYearAnalysis.trend === 'increasing' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                insights.yearOverYearAnalysis.trend === 'decreasing' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
              }`}>
                Trend: {insights.yearOverYearAnalysis.trend}
              </div>
              {insights.yearOverYearAnalysis.majorChanges && insights.yearOverYearAnalysis.majorChanges.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Major Changes:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {insights.yearOverYearAnalysis.majorChanges.map((change, idx) => (
                      <li key={idx}>• {change}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-sm text-indigo-600 dark:text-indigo-400">
                <strong>Recommendation:</strong> {insights.yearOverYearAnalysis.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIStrategicInsights;
