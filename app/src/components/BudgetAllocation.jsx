import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCSV';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BudgetAllocation = () => {
  const [quarterlyBudgets, setQuarterlyBudgets] = useLocalStorage('quarterlyBudgets', {
    q1: 250000,
    q2: 250000,
    q3: 250000,
    q4: 200000,
  });

  const [holdbackPercent, setHoldbackPercent] = useLocalStorage('holdbackPercent', 10);

  const [exceptions, setExceptions] = useLocalStorage('budgetExceptions', [
    { id: 1, name: '', q1: 0, q2: 0, q3: 0, q4: 0 },
    { id: 2, name: '', q1: 0, q2: 0, q3: 0, q4: 0 },
  ]);

  const [focusAreas, setFocusAreas] = useLocalStorage('focusAreas', []);
  const [nextId, setNextId] = useState(100);

  const [newFocusArea, setNewFocusArea] = useState({
    name: '',
    members: 1,
    method: 'equal',
    customAmount: 0,
    percentage: 0,
    notes: '',
  });

  const totalAnnualBudget = Object.values(quarterlyBudgets).reduce((sum, val) => sum + val, 0);
  const totalHoldback = totalAnnualBudget * (holdbackPercent / 100);
  const availableForAllocation = totalAnnualBudget - totalHoldback;

  const totalExceptions = exceptions.reduce(
    (sum, exc) => sum + exc.q1 + exc.q2 + exc.q3 + exc.q4,
    0
  );

  const remainingAfterExceptions = availableForAllocation - totalExceptions;

  const calculateFocusAreaBudget = (area) => {
    if (area.method === 'equal') {
      return (remainingAfterExceptions / focusAreas.reduce((sum, fa) => sum + fa.members, 0)) * area.members;
    } else if (area.method === 'custom') {
      return area.customAmount;
    } else if (area.method === 'percentage') {
      return remainingAfterExceptions * (area.percentage / 100);
    }
    return 0;
  };

  const totalAllocated = focusAreas.reduce((sum, area) => sum + calculateFocusAreaBudget(area), 0);
  const remainingUnallocated = remainingAfterExceptions - totalAllocated;

  const addFocusArea = () => {
    if (!newFocusArea.name) return;
    
    setFocusAreas([
      ...focusAreas,
      {
        id: nextId,
        ...newFocusArea,
      },
    ]);
    setNextId(nextId + 1);
    setNewFocusArea({
      name: '',
      members: 1,
      method: 'equal',
      customAmount: 0,
      percentage: 0,
      notes: '',
    });
  };

  const removeFocusArea = (id) => {
    setFocusAreas(focusAreas.filter((area) => area.id !== id));
  };

  const handleExport = () => {
    const data = [
      ['Budget Allocation Plan'],
      [''],
      ['Annual Budget Summary'],
      ['Total Annual Budget', totalAnnualBudget],
      ['Holdback Reserve', totalHoldback],
      ['Available for Allocation', availableForAllocation],
      ['Total Exceptions', totalExceptions],
      ['Remaining for Focus Areas', remainingAfterExceptions],
      [''],
      ['Focus Areas'],
      ['Name', 'Members', 'Annual Budget', 'Notes'],
      ...focusAreas.map((area) => [
        area.name,
        area.members,
        calculateFocusAreaBudget(area),
        area.notes,
      ]),
      [''],
      ['Total Allocated', '', totalAllocated, ''],
      ['Remaining Unallocated', '', remainingUnallocated, ''],
    ];
    exportToCSV(data, 'budget_allocation.csv');
  };

  return (
    <div className="space-y-6">
      {/* Module Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          Budget Allocation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Distribute your total annual budget across cost centers and focus areas. Set aside holdback reserves
          for flexibility, manage exceptions, and allocate remaining funds by team size or custom amounts.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">How to use:</p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-disc">
            <li>Enter quarterly budgets (Q1-Q4)</li>
            <li>Set holdback percentage for organizational flexibility</li>
            <li>Add up to 2 exceptions (e.g., Executive T&E, Meeting Rooms)</li>
            <li>Create focus areas and allocate by equal distribution, custom amount, or percentage</li>
            <li>Export complete allocation plan to CSV</li>
          </ul>
        </div>
      </div>

      {/* Budget Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quarterly Budget Input</h3>
          <div className="grid grid-cols-2 gap-4">
            {['q1', 'q2', 'q3', 'q4'].map((quarter) => (
              <div key={quarter}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {quarter.toUpperCase()} Budget ($)
                </label>
                <input
                  type="number"
                  value={quarterlyBudgets[quarter]}
                  onChange={(e) =>
                    setQuarterlyBudgets({
                      ...quarterlyBudgets,
                      [quarter]: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Holdback Percentage (%)
            </label>
            <input
              type="number"
              value={holdbackPercent}
              onChange={(e) => setHoldbackPercent(parseFloat(e.target.value) || 0)}
              min="0"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <small className="text-gray-600 dark:text-gray-400">Reserve for flexible allocation across the organization</small>
          </div>

          <div className="mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Annual Budget:</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalAnnualBudget)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total Holdback Reserve:</span>
              <span className="font-bold text-primary dark:text-primary-light">{formatCurrency(totalHoldback)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Available for Allocation:</span>
              <span className="font-bold text-primary">{formatCurrency(availableForAllocation)}</span>
            </div>
          </div>
        </div>

        {/* Budget Exceptions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Exceptions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Add up to 2 special allocations per quarter (e.g., Executive T&E, Meeting Room Bookings)
          </p>

          {exceptions.map((exc, index) => (
            <div key={exc.id} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exception {index + 1} Name
                </label>
                <input
                  type="text"
                  value={exc.name}
                  onChange={(e) =>
                    setExceptions(
                      exceptions.map((ex) =>
                        ex.id === exc.id ? { ...ex, name: e.target.value } : ex
                      )
                    )
                  }
                  placeholder={`e.g., ${index === 0 ? 'Executive Allocation' : 'Facility & Meeting Rooms'}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['q1', 'q2', 'q3', 'q4'].map((quarter) => (
                  <div key={quarter}>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {quarter.toUpperCase()} Amount ($)
                    </label>
                    <input
                      type="number"
                      value={exc[quarter]}
                      onChange={(e) =>
                        setExceptions(
                          exceptions.map((ex) =>
                            ex.id === exc.id
                              ? { ...ex, [quarter]: parseFloat(e.target.value) || 0 }
                              : ex
                          )
                        )
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm font-semibold text-primary">
                Annual Total: {formatCurrency(exc.q1 + exc.q2 + exc.q3 + exc.q4)}
              </div>
            </div>
          ))}

          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-700 dark:text-gray-300">Remaining for Focus Areas:</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(remainingAfterExceptions)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Area Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Focus Area</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area Name</label>
              <input
                type="text"
                value={newFocusArea.name}
                onChange={(e) => setNewFocusArea({ ...newFocusArea, name: e.target.value })}
                placeholder="e.g., Design Systems, UX Research, Product Design"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Members</label>
                <input
                  type="number"
                  value={newFocusArea.members}
                  onChange={(e) =>
                    setNewFocusArea({ ...newFocusArea, members: parseInt(e.target.value) || 1 })
                  }
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allocation Method</label>
                <select
                  value={newFocusArea.method}
                  onChange={(e) => setNewFocusArea({ ...newFocusArea, method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="equal">Equal per Person</option>
                  <option value="custom">Custom Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
            </div>

            {newFocusArea.method === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom Annual Amount ($)
                </label>
                <input
                  type="number"
                  value={newFocusArea.customAmount}
                  onChange={(e) =>
                    setNewFocusArea({ ...newFocusArea, customAmount: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            {newFocusArea.method === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Percentage of Remaining Budget (%)
                </label>
                <input
                  type="number"
                  value={newFocusArea.percentage}
                  onChange={(e) =>
                    setNewFocusArea({ ...newFocusArea, percentage: parseFloat(e.target.value) || 0 })
                  }
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={newFocusArea.notes}
                onChange={(e) => setNewFocusArea({ ...newFocusArea, notes: e.target.value })}
                placeholder="Additional details about this focus area"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={addFocusArea}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Add Focus Area
            </button>
          </div>
        </div>

        {/* Current Focus Areas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Focus Areas</h3>
          
          {focusAreas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No focus areas added yet. Add your first focus area to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {focusAreas.map((area) => (
                <div
                  key={area.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{area.name}</h4>
                      <p className="text-sm text-gray-600">
                        {area.members} member{area.members > 1 ? 's' : ''} • {area.method}
                      </p>
                      {area.notes && <p className="text-xs text-gray-500 mt-1">{area.notes}</p>}
                    </div>
                    <button
                      onClick={() => removeFocusArea(area.id)}
                      className="text-red-500 hover:text-red-700 font-bold text-xl ml-2"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(calculateFocusAreaBudget(area))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {focusAreas.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Allocated:</span>
                <span className="font-bold text-primary">{formatCurrency(totalAllocated)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Remaining Unallocated:</span>
                <span className={`font-bold ${remainingUnallocated < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(remainingUnallocated)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overview Summary */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Complete Budget Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Annual Budget</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAnnualBudget)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Holdback Reserve</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalHoldback)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Exception Allocations</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExceptions)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Focus Area Budgets</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAllocated)}</div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Export Budget Plan to CSV
        </button>
      </div>
    </div>
  );
};

export default BudgetAllocation;
