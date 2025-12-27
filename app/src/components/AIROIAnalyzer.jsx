import { useState } from 'react';
import { Sparkles, Loader2, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { aiService } from '../utils/aiService';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const AIROIAnalyzer = ({ roiData }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const getAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = {
        investment: roiData.investment,
        timeSavings: roiData.timeSavings,
        qualityImprovements: roiData.qualityImprovements,
        efficiencyGains: roiData.efficiencyGains,
        context: roiData.context || 'Design operations initiative'
      };
      
      const result = await aiService.analyzeROI(data);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to get AI analysis. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-green-200 dark:border-green-900 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI ROI Analyzer</h3>
        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">BETA</span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Get AI-powered insights on your ROI calculations, including industry benchmarks, risk factors, and strategic recommendations.
      </p>

      <button
        onClick={getAnalysis}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Get AI Analysis
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="mt-6 space-y-4">
          {/* ROI Analysis Summary */}
          {analysis.roiAnalysis && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">ROI Analysis</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {analysis.roiAnalysis.totalAnnualBenefit && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Annual Benefit</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(analysis.roiAnalysis.totalAnnualBenefit)}
                    </p>
                  </div>
                )}
                {analysis.roiAnalysis.roiPercentage && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ROI</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatPercentage(analysis.roiAnalysis.roiPercentage / 100)}
                    </p>
                  </div>
                )}
                {analysis.roiAnalysis.paybackMonths && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payback Period</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {analysis.roiAnalysis.paybackMonths} months
                    </p>
                  </div>
                )}
                {analysis.roiAnalysis.confidenceLevel && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {analysis.roiAnalysis.confidenceLevel}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Insights */}
          {analysis.insights && analysis.insights.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Key Insights</h4>
              </div>
              <ul className="space-y-2">
                {analysis.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                    {idx + 1}. {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Factors */}
          {analysis.riskFactors && analysis.riskFactors.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Risk Factors</h4>
              </div>
              <ul className="space-y-1">
                {analysis.riskFactors.map((risk, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                    • {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benchmarks */}
          {analysis.benchmarks && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Industry Benchmarks</h4>
              {analysis.benchmarks.industryAverage && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Industry Average:</strong> {analysis.benchmarks.industryAverage}
                </p>
              )}
              {analysis.benchmarks.yourPosition && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Your Position:</strong> {analysis.benchmarks.yourPosition}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIROIAnalyzer;
