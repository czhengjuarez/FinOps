import { useState } from 'react';
import { ClipboardList, Download } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCSV';
import { useLocalStorage } from '../hooks/useLocalStorage';

const VendorTracker = () => {
  const [activeTab, setActiveTab] = useState('tooling');
  const [tools, setTools] = useLocalStorage('vendorTools', []);
  const [vendors, setVendors] = useLocalStorage('vendorConsultants', []);
  const [nextId, setNextId] = useState(100);

  const [newTool, setNewTool] = useState({
    name: '',
    type: 'new',
    date: '',
    annualCost: 0,
    licenses: 1,
    prevCost: 0,
  });

  const [newVendor, setNewVendor] = useState({
    name: '',
    service: 'Design Consulting',
    date: '',
    contractValue: 0,
    duration: 12,
    notes: '',
  });

  const totalTooling = tools.reduce((sum, tool) => sum + tool.annualCost, 0);
  const totalVendors = vendors.reduce((sum, vendor) => sum + vendor.contractValue, 0);
  const totalBudget = totalTooling + totalVendors;
  const monthlyAverage = totalBudget / 12;

  const addTool = () => {
    if (!newTool.name) return;
    
    setTools([
      ...tools,
      {
        id: nextId,
        ...newTool,
        increase: newTool.type === 'renewal' ? newTool.annualCost - newTool.prevCost : 0,
        increasePercent: newTool.type === 'renewal' && newTool.prevCost > 0 
          ? ((newTool.annualCost - newTool.prevCost) / newTool.prevCost) * 100 
          : 0,
      },
    ]);
    setNextId(nextId + 1);
    setNewTool({
      name: '',
      type: 'new',
      date: '',
      annualCost: 0,
      licenses: 1,
      prevCost: 0,
    });
  };

  const removeTool = (id) => {
    setTools(tools.filter((tool) => tool.id !== id));
  };

  const addVendor = () => {
    if (!newVendor.name) return;
    
    setVendors([
      ...vendors,
      {
        id: nextId,
        ...newVendor,
        monthlyRate: newVendor.duration > 0 ? newVendor.contractValue / newVendor.duration : 0,
      },
    ]);
    setNextId(nextId + 1);
    setNewVendor({
      name: '',
      service: 'Design Consulting',
      date: '',
      contractValue: 0,
      duration: 12,
      notes: '',
    });
  };

  const removeVendor = (id) => {
    setVendors(vendors.filter((vendor) => vendor.id !== id));
  };

  const handleExportTools = () => {
    const data = [
      ['Tool/Software Name', 'Type', 'Date', 'Annual Cost', 'Licenses', 'Previous Cost', 'Increase', 'Increase %'],
      ...tools.map((tool) => [
        tool.name,
        tool.type,
        tool.date,
        tool.annualCost,
        tool.licenses,
        tool.prevCost || 'N/A',
        tool.increase || 'N/A',
        tool.increasePercent ? `${tool.increasePercent.toFixed(1)}%` : 'N/A',
      ]),
      ['', '', '', '', '', '', '', ''],
      ['Total Annual Tooling Cost', '', '', totalTooling, '', '', '', ''],
    ];
    exportToCSV(data, 'vendor_tooling.csv');
  };

  const handleExportVendors = () => {
    const data = [
      ['Vendor/Consultant Name', 'Service Type', 'Start Date', 'Contract Value', 'Duration (months)', 'Monthly Rate', 'Notes'],
      ...vendors.map((vendor) => [
        vendor.name,
        vendor.service,
        vendor.date,
        vendor.contractValue,
        vendor.duration,
        vendor.monthlyRate.toFixed(2),
        vendor.notes,
      ]),
      ['', '', '', '', '', '', ''],
      ['Total Vendor Contracts', '', '', totalVendors, '', '', ''],
    ];
    exportToCSV(data, 'vendor_consultants.csv');
  };

  const handleExportCombined = () => {
    const data = [
      ['Budget Summary'],
      ['Total Annual Tooling', totalTooling],
      ['Total Vendor Contracts', totalVendors],
      ['Combined Annual Budget', totalBudget],
      ['Average Monthly Cost', monthlyAverage],
      [''],
      ['Tooling & Software'],
      ['Name', 'Type', 'Annual Cost', 'Licenses'],
      ...tools.map((tool) => [tool.name, tool.type, tool.annualCost, tool.licenses]),
      [''],
      ['Vendors & Consultants'],
      ['Name', 'Service', 'Contract Value', 'Duration'],
      ...vendors.map((vendor) => [vendor.name, vendor.service, vendor.contractValue, vendor.duration]),
    ];
    exportToCSV(data, 'vendor_budget_complete.csv');
  };

  return (
    <div className="space-y-6">
      {/* Module Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" />
          Vendor & Tooling Tracker
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Track vendor contracts, tooling subscriptions, and consultation costs with renewal tracking and budget analysis.
          Monitor contract renewals, compare year-over-year increases, and export data for budget planning.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">How to use:</p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-disc">
            <li>Add tooling/software subscriptions with renewal tracking</li>
            <li>Track vendor and consultant contracts with duration and monthly rates</li>
            <li>Monitor total annual costs and monthly averages</li>
            <li>Export individual or combined data to CSV for budget reviews</li>
            <li>Set renewal dates to plan ahead for contract negotiations</li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('tooling')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tooling'
                ? 'border-primary text-primary bg-gray-100 dark:bg-gray-700'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Tooling & Software
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'vendors'
                ? 'border-primary text-primary bg-gray-100 dark:bg-gray-700'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Vendors & Consultants
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary bg-gray-100 dark:bg-gray-700'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Budget Overview
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800">
          {activeTab === 'tooling' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Tooling/Software</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tool/Software Name</label>
                    <input
                      type="text"
                      value={newTool.name}
                      onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                      placeholder="e.g., Figma, Adobe Creative Cloud"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contract Type</label>
                      <select
                        value={newTool.type}
                        onChange={(e) => setNewTool({ ...newTool, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="new">New Contract</option>
                        <option value="renewal">Renewal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start/Renewal Date</label>
                      <input
                        type="date"
                        value={newTool.date}
                        onChange={(e) => setNewTool({ ...newTool, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Cost ($)</label>
                      <input
                        type="number"
                        value={newTool.annualCost}
                        onChange={(e) => setNewTool({ ...newTool, annualCost: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Licenses</label>
                      <input
                        type="number"
                        value={newTool.licenses}
                        onChange={(e) => setNewTool({ ...newTool, licenses: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  {newTool.type === 'renewal' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Previous Year Cost ($)</label>
                      <input
                        type="number"
                        value={newTool.prevCost}
                        onChange={(e) => setNewTool({ ...newTool, prevCost: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}
                  <button
                    onClick={addTool}
                    className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Add Tool
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Tools</h3>
                {tools.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tools added yet. Add your first tool to get started.</p>
                ) : (
                  <div className="space-y-3">
                    {tools.map((tool) => (
                      <div key={tool.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-colors dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tool.type} • {tool.licenses} license{tool.licenses > 1 ? 's' : ''}
                              {tool.date && ` • ${new Date(tool.date).toLocaleDateString()}`}
                            </p>
                            {tool.type === 'renewal' && tool.prevCost > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Previous: {formatCurrency(tool.prevCost)} • Increase: {formatCurrency(tool.increase)} ({tool.increasePercent.toFixed(1)}%)
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeTool(tool.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xl ml-2"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-lg font-bold text-primary">{formatCurrency(tool.annualCost)}/year</div>
                      </div>
                    ))}
                  </div>
                )}
                {tools.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white">Total Annual Tooling:</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(totalTooling)}</span>
                    </div>
                    <button
                      onClick={handleExportTools}
                      className="mt-3 w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Export Tools to CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Vendor/Consultant</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor/Consultant Name</label>
                    <input
                      type="text"
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      placeholder="e.g., Design Agency, UX Consultant"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Type</label>
                      <select
                        value={newVendor.service}
                        onChange={(e) => setNewVendor({ ...newVendor, service: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Design Consulting">Design Consulting</option>
                        <option value="UX Research">UX Research</option>
                        <option value="Design System">Design System</option>
                        <option value="Training">Training</option>
                        <option value="Development">Development</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newVendor.date}
                        onChange={(e) => setNewVendor({ ...newVendor, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contract Value ($)</label>
                      <input
                        type="number"
                        value={newVendor.contractValue}
                        onChange={(e) => setNewVendor({ ...newVendor, contractValue: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (months)</label>
                      <input
                        type="number"
                        value={newVendor.duration}
                        onChange={(e) => setNewVendor({ ...newVendor, duration: parseInt(e.target.value) || 12 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <input
                      type="text"
                      value={newVendor.notes}
                      onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                      placeholder="Additional details or scope notes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={addVendor}
                    className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Add Vendor
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Vendors</h3>
                {vendors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No vendors added yet. Add your first vendor to get started.</p>
                ) : (
                  <div className="space-y-3">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-colors dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{vendor.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {vendor.service} • {vendor.duration} months
                              {vendor.date && ` • ${new Date(vendor.date).toLocaleDateString()}`}
                            </p>
                            {vendor.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{vendor.notes}</p>}
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Monthly Rate: {formatCurrency(vendor.monthlyRate)}</p>
                          </div>
                          <button
                            onClick={() => removeVendor(vendor.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xl ml-2"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-lg font-bold text-primary">{formatCurrency(vendor.contractValue)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {vendors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white">Total Vendor Contracts:</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(totalVendors)}</span>
                    </div>
                    <button
                      onClick={handleExportVendors}
                      className="mt-3 w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Export Vendors to CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gray-700 dark:bg-gray-800 text-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Budget Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-sm opacity-90 mb-1">Total Annual Tooling</h4>
                    <div className="text-2xl font-bold">{formatCurrency(totalTooling)}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-sm opacity-90 mb-1">Total Vendor Contracts</h4>
                    <div className="text-2xl font-bold">{formatCurrency(totalVendors)}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-sm opacity-90 mb-1">Combined Annual Budget</h4>
                    <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-sm opacity-90 mb-1">Average Monthly Cost</h4>
                    <div className="text-2xl font-bold">{formatCurrency(monthlyAverage)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Data</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Download your vendor and tooling data as spreadsheet files</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleExportTools}
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export Tools to CSV
                  </button>
                  <button
                    onClick={handleExportVendors}
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export Vendors to CSV
                  </button>
                  <button
                    onClick={handleExportCombined}
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export Combined Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorTracker;
