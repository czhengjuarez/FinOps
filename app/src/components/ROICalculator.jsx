import { useState } from 'react';
import { Target } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import AIROIAnalyzer from './AIROIAnalyzer';

const ROICalculator = () => {
  const [activeTab, setActiveTab] = useState('design-system');

  const tabs = [
    { id: 'design-system', name: 'Design System' },
    { id: 'tooling', name: 'Tooling ROI' },
    { id: 'headcount', name: 'Headcount Planning' },
    { id: 'budget', name: 'Budget Allocation' },
  ];

  return (
    <div className="space-y-6">
      {/* Module Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          ROI Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Calculate return on investment for design systems, tools, headcount, and budget allocation.
          Build data-driven business cases to justify design investments and demonstrate value to leadership.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">How to use:</p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-disc">
            <li><strong>Design System:</strong> Calculate efficiency gains and payback period</li>
            <li><strong>Tooling ROI:</strong> Measure time savings value vs. tool costs</li>
            <li><strong>Headcount Planning:</strong> Determine optimal team size for project queue</li>
            <li><strong>Budget Allocation:</strong> Distribute budget across categories with recommendations</li>
          </ul>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-gray-100 dark:bg-gray-700'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-6 bg-white dark:bg-gray-800">
          {activeTab === 'design-system' && <DesignSystemCalculator />}
          {activeTab === 'tooling' && <ToolingCalculator />}
          {activeTab === 'headcount' && <HeadcountCalculator />}
          {activeTab === 'budget' && <BudgetCalculator />}
        </div>
      </div>
    </div>
  );
};

const DesignSystemCalculator = () => {
  const [inputs, setInputs] = useState({
    designers: 8,
    hourlyRate: 75,
    componentHours: 5,
    implementationCost: 150000,
    efficiencyGain: 40,
  });

  const weeklySavings = inputs.designers * inputs.componentHours * inputs.hourlyRate * (inputs.efficiencyGain / 100);
  const annualSavings = weeklySavings * 52;
  const paybackMonths = inputs.implementationCost / (annualSavings / 12);
  const threeYearROI = ((annualSavings * 3 - inputs.implementationCost) / inputs.implementationCost) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design System Investment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Designers</label>
            <input
              type="number"
              value={inputs.designers}
              onChange={(e) => setInputs({ ...inputs, designers: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Designer Hourly Rate ($)</label>
            <input
              type="number"
              value={inputs.hourlyRate}
              onChange={(e) => setInputs({ ...inputs, hourlyRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hours Spent Creating Components Weekly (per designer)
            </label>
            <input
              type="number"
              value={inputs.componentHours}
              onChange={(e) => setInputs({ ...inputs, componentHours: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Design System Implementation Cost ($)
            </label>
            <input
              type="number"
              value={inputs.implementationCost}
              onChange={(e) => setInputs({ ...inputs, implementationCost: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Efficiency Gain (%)</label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              (Target Efficiency - Baseline Efficiency) / Baseline Efficiency × 100%
            </p>
            <input
              type="number"
              value={inputs.efficiencyGain}
              onChange={(e) => setInputs({ ...inputs, efficiencyGain: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design System ROI Results</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Savings</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(annualSavings)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payback Period</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{paybackMonths.toFixed(1)} months</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">3-Year ROI</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{threeYearROI.toFixed(0)}%</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-800 mb-1">Key Benefits:</p>
            <p className="text-gray-700">
              Reduced design time, consistent UI, faster development, lower maintenance costs
            </p>
          </div>
        </div>
      </div>

      {/* AI ROI Analyzer */}
      <AIROIAnalyzer roiData={{
        investment: inputs.implementationCost,
        timeSavings: {
          hours: inputs.designers * inputs.componentHours * 4,
          hourlyRate: inputs.hourlyRate
        },
        qualityImprovements: {
          defectReduction: 30,
          costPerDefect: 500
        },
        efficiencyGains: {
          processImprovement: inputs.efficiencyGain,
          currentCost: inputs.designers * inputs.hourlyRate * 40 * 52
        },
        context: 'Design System Implementation'
      }} />
    </div>
  );
};

const ToolingCalculator = () => {
  const [inputs, setInputs] = useState({
    users: 12,
    annualCost: 15000,
    timeSaved: 3,
    hourlyRate: 70,
    setupCost: 8000,
  });

  const annualTimeSavings = inputs.users * inputs.timeSaved * 52 * inputs.hourlyRate;
  const totalAnnualCost = inputs.annualCost + inputs.setupCost;
  const annualROI = ((annualTimeSavings - totalAnnualCost) / totalAnnualCost) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design Tooling Investment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Design Tool Users</label>
            <input
              type="number"
              value={inputs.users}
              onChange={(e) => setInputs({ ...inputs, users: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Tool Cost ($)</label>
            <input
              type="number"
              value={inputs.annualCost}
              onChange={(e) => setInputs({ ...inputs, annualCost: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Saved Per User Per Week (hours)
            </label>
            <input
              type="number"
              value={inputs.timeSaved}
              onChange={(e) => setInputs({ ...inputs, timeSaved: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average User Hourly Rate ($)</label>
            <input
              type="number"
              value={inputs.hourlyRate}
              onChange={(e) => setInputs({ ...inputs, hourlyRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Setup/Training Cost ($)</label>
            <input
              type="number"
              value={inputs.setupCost}
              onChange={(e) => setInputs({ ...inputs, setupCost: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tooling ROI Results</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Time Savings Value</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(annualTimeSavings)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Annual Cost</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAnnualCost)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual ROI</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{annualROI.toFixed(0)}%</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-800 mb-1">Additional Benefits:</p>
            <p className="text-gray-700">
              Improved collaboration, reduced errors, better file management, enhanced capabilities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeadcountCalculator = () => {
  const [inputs, setInputs] = useState({
    currentCount: 6,
    projectsQueue: 12,
    projectDuration: 6,
    desiredTimeline: 24,
    designerCost: 140000,
    revenuePerProject: 500000,
  });

  const totalProjectWeeks = inputs.projectsQueue * inputs.projectDuration;
  const recommendedSize = Math.ceil(totalProjectWeeks / inputs.desiredTimeline);
  const additionalHires = Math.max(0, recommendedSize - inputs.currentCount);
  const investmentCost = additionalHires * inputs.designerCost;
  const revenueImpact = inputs.projectsQueue * inputs.revenuePerProject;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Headcount Planning Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Designer Count</label>
            <input
              type="number"
              value={inputs.currentCount}
              onChange={(e) => setInputs({ ...inputs, currentCount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projects in Queue</label>
            <input
              type="number"
              value={inputs.projectsQueue}
              onChange={(e) => setInputs({ ...inputs, projectsQueue: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Project Duration (weeks)</label>
            <input
              type="number"
              value={inputs.projectDuration}
              onChange={(e) => setInputs({ ...inputs, projectDuration: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desired Completion Timeline (weeks)</label>
            <input
              type="number"
              value={inputs.desiredTimeline}
              onChange={(e) => setInputs({ ...inputs, desiredTimeline: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Designer Annual Cost ($)</label>
            <input
              type="number"
              value={inputs.designerCost}
              onChange={(e) => setInputs({ ...inputs, designerCost: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revenue Per Project ($)</label>
            <input
              type="number"
              value={inputs.revenuePerProject}
              onChange={(e) => setInputs({ ...inputs, revenuePerProject: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Headcount Analysis</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommended Team Size</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{recommendedSize} designers</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Hires Needed</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{additionalHires} designers</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Investment vs. Revenue Impact</h4>
            <div className="text-sm text-gray-700 mb-1">Investment: {formatCurrency(investmentCost)}</div>
            <div className="text-sm text-gray-700">Potential Revenue: {formatCurrency(revenueImpact)}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-800 mb-1">Considerations:</p>
            <p className="text-gray-700">
              Onboarding time, skill matching, team dynamics, budget constraints
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BudgetCalculator = () => {
  const [inputs, setInputs] = useState({
    totalBudget: 800000,
    headcountPercent: 75,
    toolsPercent: 8,
    trainingPercent: 7,
    opsPercent: 10,
  });

  const headcountAmount = inputs.totalBudget * (inputs.headcountPercent / 100);
  const toolsAmount = inputs.totalBudget * (inputs.toolsPercent / 100);
  const trainingAmount = inputs.totalBudget * (inputs.trainingPercent / 100);
  const opsAmount = inputs.totalBudget * (inputs.opsPercent / 100);
  const totalAllocated = headcountAmount + toolsAmount + trainingAmount + opsAmount;
  const totalPercent = inputs.headcountPercent + inputs.toolsPercent + inputs.trainingPercent + inputs.opsPercent;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Allocation Framework</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Annual Design Budget ($)</label>
            <input
              type="number"
              value={inputs.totalBudget}
              onChange={(e) => setInputs({ ...inputs, totalBudget: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Headcount % (recommended: 70-80%)
            </label>
            <input
              type="number"
              value={inputs.headcountPercent}
              onChange={(e) => setInputs({ ...inputs, headcountPercent: parseFloat(e.target.value) || 0 })}
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tools & Software % (recommended: 5-10%)
            </label>
            <input
              type="number"
              value={inputs.toolsPercent}
              onChange={(e) => setInputs({ ...inputs, toolsPercent: parseFloat(e.target.value) || 0 })}
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Training & Development % (recommended: 5-10%)
            </label>
            <input
              type="number"
              value={inputs.trainingPercent}
              onChange={(e) => setInputs({ ...inputs, trainingPercent: parseFloat(e.target.value) || 0 })}
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Operations & Misc % (recommended: 5-15%)
            </label>
            <input
              type="number"
              value={inputs.opsPercent}
              onChange={(e) => setInputs({ ...inputs, opsPercent: parseFloat(e.target.value) || 0 })}
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Breakdown</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headcount Budget</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(headcountAmount)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tools & Software</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(toolsAmount)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Training & Development</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(trainingAmount)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Operations & Miscellaneous</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(opsAmount)}</div>
          </div>
          <div className={`border-2 rounded-lg p-4 ${totalPercent === 100 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <h4 className="text-sm font-medium mb-1">Total Allocated</h4>
            <div className="text-2xl font-bold">{formatCurrency(totalAllocated)}</div>
            <div className="text-sm mt-1">
              {totalPercent}% of budget {totalPercent !== 100 && `(${totalPercent > 100 ? 'over' : 'under'} by ${Math.abs(100 - totalPercent)}%)`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
