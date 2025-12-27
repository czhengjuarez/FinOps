import { useState } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useLocalStorage } from '../hooks/useLocalStorage';

const HeadcountPlanning = () => {
  const defaultLevels = [
    { id: 1, code: 'P1', type: 'IC', title: 'Associate Designer', count: 0, avgSalary: 75000 },
    { id: 2, code: 'P2', type: 'IC', title: 'Designer', count: 0, avgSalary: 95000 },
    { id: 3, code: 'P3', type: 'IC', title: 'Senior Designer', count: 0, avgSalary: 120000 },
    { id: 4, code: 'P4', type: 'IC', title: 'Staff Designer', count: 0, avgSalary: 150000 },
    { id: 5, code: 'P5', type: 'IC', title: 'Principal Designer', count: 0, avgSalary: 180000 },
    { id: 6, code: 'P6', type: 'IC', title: 'Distinguished Designer', count: 0, avgSalary: 220000 },
    { id: 7, code: 'M1', type: 'Manager', title: 'Design Manager', count: 0, avgSalary: 140000 },
    { id: 8, code: 'M2', type: 'Manager', title: 'Senior Design Manager', count: 0, avgSalary: 160000 },
    { id: 9, code: 'M3', type: 'Manager', title: 'Design Director', count: 0, avgSalary: 190000 },
    { id: 10, code: 'M4', type: 'Manager', title: 'Senior Design Director', count: 0, avgSalary: 220000 },
    { id: 11, code: 'M5', type: 'Manager', title: 'VP of Design', count: 0, avgSalary: 260000 },
    { id: 12, code: 'M6', type: 'Manager', title: 'Senior VP of Design', count: 0, avgSalary: 300000 },
  ];

  const [levels, setLevels] = useLocalStorage('headcountLevelsV2', defaultLevels);
  const [newLevel, setNewLevel] = useState({
    code: '',
    type: 'IC',
    title: '',
    count: 0,
    avgSalary: 0,
  });
  const [nextId, setNextId] = useState(13);

  const updateLevel = (id, field, value) => {
    setLevels(levels.map(level => 
      level.id === id ? { ...level, [field]: parseFloat(value) || 0 } : level
    ));
  };

  const addLevel = () => {
    if (!newLevel.code || !newLevel.title) return;
    
    setLevels([...levels, { ...newLevel, id: nextId }]);
    setNextId(nextId + 1);
    setNewLevel({
      code: '',
      type: 'IC',
      title: '',
      count: 0,
      avgSalary: 0,
    });
  };

  const removeLevel = (id) => {
    setLevels(levels.filter(level => level.id !== id));
  };

  const totalHeadcount = levels.reduce((sum, level) => sum + level.count, 0);
  const totalSalaryCost = levels.reduce((sum, level) => sum + (level.count * level.avgSalary), 0);
  const icCount = levels.filter(l => l.type === 'IC').reduce((sum, level) => sum + level.count, 0);
  const managerCount = levels.filter(l => l.type === 'Manager').reduce((sum, level) => sum + level.count, 0);
  const avgSalary = totalHeadcount > 0 ? totalSalaryCost / totalHeadcount : 0;

  return (
    <div className="space-y-6">
      {/* Module Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Headcount Planning
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Plan your design team headcount across professional levels (P1-P6 IC) and management levels (M1-M6). 
          Calculate total salary costs and analyze team composition.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">How to use:</p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-disc">
            <li>Enter headcount for each professional level (P1-P6 for ICs, M1-M6 for Managers)</li>
            <li>Adjust average salaries based on your market and location</li>
            <li>Add custom levels if your organization has different structures</li>
            <li>Review total costs and team composition in the summary</li>
          </ul>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Headcount</h4>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalHeadcount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Salary Cost</h4>
          <p className="text-4xl font-bold text-primary mt-2">{formatCurrency(totalSalaryCost)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">IC / Manager Ratio</h4>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{icCount} / {managerCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Average Salary</h4>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(avgSalary)}</p>
        </div>
      </div>

      {/* IC Levels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Individual Contributors (IC)</h3>
        <div className="space-y-3">
          {levels.filter(l => l.type === 'IC').map(level => (
            <div key={level.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{level.code}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">{level.title}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Headcount</label>
                <input
                  type="number"
                  value={level.count}
                  onChange={(e) => updateLevel(level.id, 'count', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Avg Salary ($)</label>
                <input
                  type="number"
                  value={level.avgSalary}
                  onChange={(e) => updateLevel(level.id, 'avgSalary', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Cost</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(level.count * level.avgSalary)}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => removeLevel(level.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove level"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manager Levels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Management Levels</h3>
        <div className="space-y-3">
          {levels.filter(l => l.type === 'Manager').map(level => (
            <div key={level.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{level.code}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">{level.title}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Headcount</label>
                <input
                  type="number"
                  value={level.count}
                  onChange={(e) => updateLevel(level.id, 'count', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Avg Salary ($)</label>
                <input
                  type="number"
                  value={level.avgSalary}
                  onChange={(e) => updateLevel(level.id, 'avgSalary', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Cost</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(level.count * level.avgSalary)}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => removeLevel(level.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove level"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Level */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Custom Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level Code</label>
            <input
              type="text"
              value={newLevel.code}
              onChange={(e) => setNewLevel({ ...newLevel, code: e.target.value })}
              placeholder="e.g., P7, M7"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              value={newLevel.type}
              onChange={(e) => setNewLevel({ ...newLevel, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="IC">IC</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={newLevel.title}
              onChange={(e) => setNewLevel({ ...newLevel, title: e.target.value })}
              placeholder="e.g., Lead Designer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avg Salary ($)</label>
            <input
              type="number"
              value={newLevel.avgSalary}
              onChange={(e) => setNewLevel({ ...newLevel, avgSalary: parseFloat(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addLevel}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Level
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadcountPlanning;
