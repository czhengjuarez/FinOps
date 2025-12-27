import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { aiService } from '../utils/aiService';
import { formatCurrency } from '../utils/formatters';

const AITravelOptimizer = ({ estimateData }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const getOptimization = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = {
        attendees: estimateData.domesticTravelers + estimateData.internationalTravelers,
        nights: estimateData.nights,
        location: estimateData.location,
        budget: estimateData.totalCost,
        dates: estimateData.dates
      };
      
      const result = await aiService.optimizeTravel(data);
      setRecommendations(result);
    } catch (err) {
      setError('Failed to get AI recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Travel Optimizer</h3>
        <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">BETA</span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Get AI-powered recommendations for optimal timing, cost-effective locations, and money-saving strategies.
      </p>

      <button
        onClick={getOptimization}
        disabled={loading}
        className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Get AI Recommendations
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {recommendations && (
        <div className="mt-6 space-y-4">
          {/* Optimal Timing */}
          {recommendations.optimalTiming && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📅 Optimal Timing</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Best Months:</strong> {recommendations.optimalTiming.bestMonths?.join(', ') || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {recommendations.optimalTiming.reasoning}
              </p>
              {recommendations.optimalTiming.potentialSavings && (
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  💰 Potential Savings: {recommendations.optimalTiming.potentialSavings}
                </p>
              )}
            </div>
          )}

          {/* Location Recommendations */}
          {recommendations.locationRecommendations && recommendations.locationRecommendations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📍 Location Recommendations</h4>
              <div className="space-y-3">
                {recommendations.locationRecommendations.map((loc, idx) => (
                  <div key={idx} className="border-l-4 border-purple-500 pl-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{loc.city}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Est. {formatCurrency(loc.estimatedCostPerPerson)}/person
                    </p>
                    {loc.pros && loc.pros.length > 0 && (
                      <ul className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {loc.pros.map((pro, i) => (
                          <li key={i}>✓ {pro}</li>
                        ))}
                      </ul>
                    )}
                    {loc.cons && loc.cons.length > 0 && (
                      <ul className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {loc.cons.map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Optimization */}
          {recommendations.costOptimization && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Cost Optimization Tips</h4>
              {recommendations.costOptimization.flightTips && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Flights:</strong> {recommendations.costOptimization.flightTips}
                </p>
              )}
              {recommendations.costOptimization.hotelTips && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Hotels:</strong> {recommendations.costOptimization.hotelTips}
                </p>
              )}
              {recommendations.costOptimization.estimatedTotal && (
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-2">
                  Estimated Total: {formatCurrency(recommendations.costOptimization.estimatedTotal)}
                </p>
              )}
              {recommendations.costOptimization.confidenceLevel && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Confidence: {recommendations.costOptimization.confidenceLevel}
                </p>
              )}
            </div>
          )}

          {/* Risk Factors */}
          {recommendations.riskFactors && recommendations.riskFactors.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚠️ Risk Factors</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {recommendations.riskFactors.map((risk, idx) => (
                  <li key={idx}>• {risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AITravelOptimizer;
