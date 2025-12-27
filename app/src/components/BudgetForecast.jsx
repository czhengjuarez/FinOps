import { useState } from 'react';
import { BarChart3, Download, RefreshCw } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCSV';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BudgetForecast = () => {
  const [rawForecastData, setRawForecastData] = useLocalStorage('budgetForecast', {
    headcount: { count: 65, avgSalary: 120000, benefitsRate: 0.28 },
    tne: {
      individualTrips: [
        { id: 1, name: 'Q1 Conference', flight: 800, hotel: 1100, ground: 150, perDiem: 375 },
      ],
      groupTravel: [
        { id: 1, attendees: 10, avgFlight: 750, hotelPerNight: 250, nights: 3, perDiem: 75 },
      ],
      teamActivities: [
        { id: 1, attendees: 0, activityPerPerson: 200, dinnerPerPerson: 120 },
      ],
    },
    vendors: [
      { id: 1, name: 'Design Tools', cost: 55000 },
      { id: 2, name: 'UXR Tools', cost: 32000 },
    ],
    consultants: [{ id: 1, name: 'Project Alpha', cost: 75000 }],
  });

  // Migrate old data format to new array format
  const forecastData = {
    ...rawForecastData,
    tne: {
      ...rawForecastData.tne,
      groupTravel: Array.isArray(rawForecastData.tne.groupTravel) 
        ? rawForecastData.tne.groupTravel 
        : [{ id: 1, ...rawForecastData.tne.groupTravel }],
      teamActivities: Array.isArray(rawForecastData.tne.teamActivities)
        ? rawForecastData.tne.teamActivities.map(activity => ({
            ...activity,
            attendees: activity.attendees !== undefined ? activity.attendees : 0
          }))
        : [{ id: 1, attendees: 0, ...rawForecastData.tne.teamActivities }],
    },
  };

  const setForecastData = (data) => {
    setRawForecastData(data);
  };

  const [previousYear, setPreviousYear] = useLocalStorage('budgetForecastPrevYear', {
    headcount: 2604000,
    tne: 84375,
    vendors: 87000,
    consultants: 75000,
  });

  const [importedSources, setImportedSources] = useLocalStorage('budgetForecastImported', {
    headcount: false,
    tne: false,
    vendorTooling: false,
    vendorConsultants: false,
  });

  const [nextId, setNextId] = useState(100);

  const importFromHeadcount = () => {
    const headcountData = localStorage.getItem('headcountLevelsV2');
    if (!headcountData) {
      alert('No headcount data found. Please enter data in the Headcount tab first.');
      return;
    }

    const levels = JSON.parse(headcountData);
    const totalHeadcount = levels.reduce((sum, level) => sum + level.count, 0);
    const totalSalaryCost = levels.reduce((sum, level) => sum + (level.count * level.avgSalary), 0);
    const avgSalary = totalHeadcount > 0 ? totalSalaryCost / totalHeadcount : 0;

    if (totalHeadcount === 0) {
      alert('No headcount entered in the Headcount tab. Please add headcount first.');
      return;
    }

    const hasExistingData = forecastData.headcount.count > 0;
    if (hasExistingData && !confirm('This will replace your current headcount data. Continue?')) {
      return;
    }

    setForecastData({
      ...forecastData,
      headcount: {
        count: totalHeadcount,
        avgSalary: Math.round(avgSalary),
        benefitsRate: forecastData.headcount.benefitsRate,
      },
    });

    setImportedSources({ ...importedSources, headcount: true });
  };

  const importFromTnE = () => {
    const tneEstimateData = localStorage.getItem('tneEstimate');
    if (!tneEstimateData) {
      alert('No T&E data found. Please enter data in the T&E Estimator tab (Estimate Mode) first.');
      return;
    }

    const estimate = JSON.parse(tneEstimateData);
    
    const totalTravelers = estimate.domesticTravelers + estimate.internationalTravelers;
    if (totalTravelers === 0) {
      alert('No travelers entered in T&E Estimate Mode. Please add traveler counts first.');
      return;
    }

    const hasExistingData = forecastData.tne.individualTrips.length > 0;
    if (hasExistingData && !confirm('This will replace your current T&E data with the Estimate Mode total. Continue?')) {
      return;
    }

    const hotelCost = totalTravelers * estimate.nights * estimate.roomRate;
    const flightCost = estimate.domesticTravelers * estimate.domesticFlight + estimate.internationalTravelers * estimate.internationalFlight;
    const perDiemCost = totalTravelers * estimate.perDiem * (estimate.nights + 1);
    const travelAllowanceCost = totalTravelers * estimate.travelAllowance;
    const dinnerCost = totalTravelers * estimate.teamDinners * estimate.dinnerCost;
    const totalEstimate = hotelCost + flightCost + perDiemCost + travelAllowanceCost + estimate.activitiesBudget + dinnerCost;

    setForecastData({
      ...forecastData,
      tne: {
        individualTrips: [{
          id: 1,
          name: `${estimate.location} Event`,
          flight: flightCost,
          hotel: hotelCost,
          ground: travelAllowanceCost,
          perDiem: perDiemCost + dinnerCost + estimate.activitiesBudget,
        }],
        groupTravel: forecastData.tne.groupTravel,
        teamActivities: forecastData.tne.teamActivities,
      },
    });

    setImportedSources({ ...importedSources, tne: true });
  };

  const importFromVendor = () => {
    const vendorToolsData = localStorage.getItem('vendorTools');
    const vendorConsultantsData = localStorage.getItem('vendorConsultants');
    
    if (!vendorToolsData && !vendorConsultantsData) {
      alert('No vendor data found. Please enter data in the Vendor Tracker tab first.');
      return;
    }

    const tools = vendorToolsData ? JSON.parse(vendorToolsData) : [];
    const consultants = vendorConsultantsData ? JSON.parse(vendorConsultantsData) : [];

    if (tools.length === 0 && consultants.length === 0) {
      alert('No vendor or consultant entries found in the Vendor Tracker tab.');
      return;
    }

    const hasExistingData = forecastData.vendors.length > 0 || forecastData.consultants.length > 0;
    if (hasExistingData && !confirm('This will replace your current vendor/consultant data. Continue?')) {
      return;
    }

    const mappedVendors = tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      cost: tool.annualCost || 0,
    }));

    const mappedConsultants = consultants.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      cost: vendor.contractValue || 0,
    }));

    setForecastData({
      ...forecastData,
      vendors: mappedVendors.length > 0 ? mappedVendors : forecastData.vendors,
      consultants: mappedConsultants.length > 0 ? mappedConsultants : forecastData.consultants,
    });

    setImportedSources({ 
      ...importedSources, 
      vendorTooling: tools.length > 0,
      vendorConsultants: consultants.length > 0
    });
  };

  const calculateCosts = () => {
    const { headcount, tne, vendors, consultants } = forecastData;
    
    const headcountCost = headcount.count * headcount.avgSalary * (1 + headcount.benefitsRate);
    
    const individualTripsCost = tne.individualTrips.reduce(
      (sum, trip) => sum + trip.flight + trip.hotel + trip.ground + trip.perDiem,
      0
    );
    
    const groupTravelCost = tne.groupTravel.reduce((sum, event) => {
      const costPerPerson =
        event.avgFlight +
        event.hotelPerNight * event.nights +
        event.perDiem * (event.nights + 1);
      return sum + (event.attendees * costPerPerson);
    }, 0);
    
    const teamActivitiesCost = tne.teamActivities.reduce((sum, activity) => {
      const attendees = activity.attendees || 0;
      return sum + (attendees * (activity.activityPerPerson + activity.dinnerPerPerson));
    }, 0);
    
    const tneCost = individualTripsCost + groupTravelCost + teamActivitiesCost;
    const vendorCost = vendors.reduce((sum, v) => sum + v.cost, 0);
    const consultantCost = consultants.reduce((sum, c) => sum + c.cost, 0);
    const totalCost = headcountCost + tneCost + vendorCost + consultantCost;

    return {
      total: totalCost,
      headcount: headcountCost,
      tne: tneCost,
      vendors: vendorCost,
      consultants: consultantCost,
      details: {
        individualTrips: individualTripsCost,
        groupTravel: groupTravelCost,
        teamActivities: teamActivitiesCost,
      },
    };
  };

  const costs = calculateCosts();
  const previousTotal = Object.values(previousYear).reduce((s, v) => s + (v || 0), 0);
  const yoyChange = previousTotal > 0 ? (costs.total - previousTotal) / previousTotal : 0;

  const addTrip = () => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        individualTrips: [
          ...forecastData.tne.individualTrips,
          { id: nextId, name: 'New Trip', flight: 0, hotel: 0, ground: 0, perDiem: 0 },
        ],
      },
    });
    setNextId(nextId + 1);
  };

  const removeTrip = (id) => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        individualTrips: forecastData.tne.individualTrips.filter((t) => t.id !== id),
      },
    });
  };

  const updateTrip = (id, field, value) => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        individualTrips: forecastData.tne.individualTrips.map((t) =>
          t.id === id ? { ...t, [field]: field === 'name' ? value : parseFloat(value) || 0 } : t
        ),
      },
    });
  };

  const addGroupTravel = () => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        groupTravel: [
          ...forecastData.tne.groupTravel,
          { id: nextId, attendees: 0, avgFlight: 0, hotelPerNight: 0, nights: 0, perDiem: 0 },
        ],
      },
    });
    setNextId(nextId + 1);
  };

  const removeGroupTravel = (id) => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        groupTravel: forecastData.tne.groupTravel.filter((g) => g.id !== id),
      },
    });
  };

  const updateGroupTravel = (id, field, value) => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        groupTravel: forecastData.tne.groupTravel.map((g) =>
          g.id === id ? { ...g, [field]: parseFloat(value) || 0 } : g
        ),
      },
    });
  };

  const addTeamActivity = () => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        teamActivities: [
          ...forecastData.tne.teamActivities,
          { id: nextId, attendees: 0, activityPerPerson: 0, dinnerPerPerson: 0 },
        ],
      },
    });
    setNextId(nextId + 1);
  };

  const removeTeamActivity = (id) => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        teamActivities: forecastData.tne.teamActivities.filter((a) => a.id !== id),
      },
    });
  };

  const updateTeamActivity = (id, field, value) => {
    setForecastData({
      ...forecastData,
      tne: {
        ...forecastData.tne,
        teamActivities: forecastData.tne.teamActivities.map((a) =>
          a.id === id ? { ...a, [field]: parseFloat(value) || 0 } : a
        ),
      },
    });
  };

  const addItem = (type) => {
    setForecastData({
      ...forecastData,
      [type]: [...forecastData[type], { id: nextId, name: '', cost: 0 }],
    });
    setNextId(nextId + 1);
  };

  const removeItem = (type, id) => {
    setForecastData({
      ...forecastData,
      [type]: forecastData[type].filter((item) => item.id !== id),
    });
  };

  const updateItem = (type, id, field, value) => {
    setForecastData({
      ...forecastData,
      [type]: forecastData[type].map((item) =>
        item.id === id ? { ...item, [field]: field === 'name' ? value : parseFloat(value) || 0 } : item
      ),
    });
  };

  const handleExport = () => {
    const data = [
      ['Category', 'Line Item', 'Current Year', 'Previous Year'],
      ['Headcount', 'Total', costs.headcount, previousYear.headcount],
      ['T&E', 'Individual Trips', costs.details.individualTrips, 'N/A'],
      ['T&E', 'Group Travel', costs.details.groupTravel, 'N/A'],
      ['T&E', 'Team Activities', costs.details.teamActivities, 'N/A'],
      ['T&E', 'Total', costs.tne, previousYear.tne],
      ['Vendors', 'Total', costs.vendors, previousYear.vendors],
      ...forecastData.vendors.map((v) => ['Vendor Detail', v.name, v.cost, 'N/A']),
      ['Consultants', 'Total', costs.consultants, previousYear.consultants],
      ...forecastData.consultants.map((c) => ['Consultant Detail', c.name, c.cost, 'N/A']),
      ['', '', '', ''],
      ['Grand Total', '', costs.total, previousTotal],
    ];
    exportToCSV(data, 'budget_forecast.csv');
  };

  return (
    <div className="space-y-6">
      {/* Module Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Budget Forecast
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Plan your annual team budget including headcount, travel & expenses, vendors, and consultants. 
          Compare year-over-year changes to identify trends and justify budget requests.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">How to use:</p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-disc">
            <li>Import data from other tabs OR enter manually below</li>
            <li>Enter previous year actuals for comparison</li>
            <li>Input current year headcount, salary, and benefits rate</li>
            <li>Add individual trips and team events for T&E planning</li>
            <li>Track vendor contracts and consultant engagements</li>
            <li>Export complete forecast to CSV for presentations</li>
          </ul>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center border-2 border-primary shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Forecast</h4>
          <p className="text-4xl font-bold text-primary mt-2">{formatCurrency(costs.total)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">YoY Change</h4>
          <p className={`text-4xl font-bold mt-2 ${yoyChange > 0 ? 'text-red-600' : yoyChange < 0 ? 'text-green-600' : 'text-gray-800'}`}>
            {formatPercentage(yoyChange)}
          </p>
        </div>
      </div>

      {/* Import Data Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Import Data from Other Tabs</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Import calculated totals from other tabs to automatically populate this forecast. You can still manually edit after importing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={importFromHeadcount}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Import from Headcount
            {importedSources.headcount && <span className="ml-2 text-xs bg-green-500 px-2 py-0.5 rounded">✓</span>}
          </button>
          <button
            onClick={importFromTnE}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Import from T&E
            {importedSources.tne && <span className="ml-2 text-xs bg-green-500 px-2 py-0.5 rounded">✓</span>}
          </button>
          <button
            onClick={importFromVendor}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Import from Vendor
            {(importedSources.vendorTooling || importedSources.vendorConsultants) && <span className="ml-2 text-xs bg-green-500 px-2 py-0.5 rounded">✓</span>}
          </button>
        </div>
      </div>

      {/* Imported Data Summary - Only show if any data has been imported */}
      {(importedSources.headcount || importedSources.tne || importedSources.vendorTooling || importedSources.vendorConsultants) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Imported Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {importedSources.headcount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headcount Cost</label>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(costs.headcount)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Imported from Headcount tab</p>
              </div>
            )}
            {importedSources.tne && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">T&E Cost</label>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(costs.tne)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Imported from T&E tab</p>
              </div>
            )}
            {importedSources.vendorTooling && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tooling Cost</label>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(costs.vendors)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Imported from Vendor tab (Tools)</p>
              </div>
            )}
            {importedSources.vendorConsultants && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor & Consultant Cost</label>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(costs.consultants)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Imported from Vendor tab (Vendors)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Previous Year Inputs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Previous Year Actuals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headcount Cost ($)</label>
            <input
              type="number"
              value={previousYear.headcount}
              onChange={(e) => setPreviousYear({ ...previousYear, headcount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">T&E Cost ($)</label>
            <input
              type="number"
              value={previousYear.tne}
              onChange={(e) => setPreviousYear({ ...previousYear, tne: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Cost ($)</label>
            <input
              type="number"
              value={previousYear.vendors}
              onChange={(e) => setPreviousYear({ ...previousYear, vendors: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consultant Cost ($)</label>
            <input
              type="number"
              value={previousYear.consultants}
              onChange={(e) => setPreviousYear({ ...previousYear, consultants: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Headcount Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">1. Headcount (HC)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of People</label>
            <input
              type="number"
              value={forecastData.headcount.count}
              onChange={(e) =>
                setForecastData({
                  ...forecastData,
                  headcount: { ...forecastData.headcount, count: parseFloat(e.target.value) || 0 },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Base Salary ($)</label>
            <input
              type="number"
              value={forecastData.headcount.avgSalary}
              onChange={(e) =>
                setForecastData({
                  ...forecastData,
                  headcount: { ...forecastData.headcount, avgSalary: parseFloat(e.target.value) || 0 },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Benefits & Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={forecastData.headcount.benefitsRate * 100}
              onChange={(e) =>
                setForecastData({
                  ...forecastData,
                  headcount: { ...forecastData.headcount, benefitsRate: parseFloat(e.target.value) / 100 || 0 },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Headcount Cost: {formatCurrency(costs.headcount)}</p>
        </div>
      </div>

      {/* T&E Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">2. Travel & Expenses (T&E)</h3>
        
        {/* Individual Trips */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Individual Travel</h4>
          {/* Column Headers */}
          <div className="grid grid-cols-6 gap-2 mb-2 px-1">
            <div className="col-span-2 text-xs font-medium text-gray-600 dark:text-gray-400">Trip Name</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Flight ($)</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Hotel ($)</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Ground ($)</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Per Diem ($)</div>
          </div>
          <div className="space-y-2">
            {forecastData.tne.individualTrips.map((trip) => (
              <div key={trip.id} className="grid grid-cols-6 gap-2 items-center">
                <input
                  type="text"
                  value={trip.name}
                  onChange={(e) => updateTrip(trip.id, 'name', e.target.value)}
                  placeholder="Trip Name"
                  className="col-span-2 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  value={trip.flight}
                  onChange={(e) => updateTrip(trip.id, 'flight', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={trip.hotel}
                  onChange={(e) => updateTrip(trip.id, 'hotel', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={trip.ground}
                  onChange={(e) => updateTrip(trip.id, 'ground', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={trip.perDiem}
                    onChange={(e) => updateTrip(trip.id, 'perDiem', e.target.value)}
                    placeholder="0"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => removeTrip(trip.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addTrip}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-semibold hover:underline"
          >
            + Add Individual Trip
          </button>
        </div>

        {/* Group Travel */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Team Get-Together</h4>
          {/* Column Headers */}
          <div className="grid grid-cols-6 gap-2 mb-2 px-1">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400"># of Attendees</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg Flight ($)</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Hotel/Night ($)</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400"># of Nights</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Per Diem/Day ($)</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400"></div>
          </div>
          <div className="space-y-2">
            {forecastData.tne.groupTravel.map((event) => (
              <div key={event.id} className="grid grid-cols-6 gap-2 items-center">
                <input
                  type="number"
                  value={event.attendees}
                  onChange={(e) => updateGroupTravel(event.id, 'attendees', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={event.avgFlight}
                  onChange={(e) => updateGroupTravel(event.id, 'avgFlight', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={event.hotelPerNight}
                  onChange={(e) => updateGroupTravel(event.id, 'hotelPerNight', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={event.nights}
                  onChange={(e) => updateGroupTravel(event.id, 'nights', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={event.perDiem}
                  onChange={(e) => updateGroupTravel(event.id, 'perDiem', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => removeGroupTravel(event.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addGroupTravel}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-semibold hover:underline"
          >
            + Add Team Get-Together
          </button>
        </div>

        {/* Team Activities */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Team Activities</h4>
          {/* Column Headers */}
          <div className="grid grid-cols-4 gap-2 mb-2 px-1">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400"># of People</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Activity Cost/Person ($)</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Dinner Cost/Person ($)</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400"></div>
          </div>
          <div className="space-y-2">
            {forecastData.tne.teamActivities.map((activity) => (
              <div key={activity.id} className="grid grid-cols-4 gap-2 items-center">
                <input
                  type="number"
                  value={activity.attendees}
                  onChange={(e) => updateTeamActivity(activity.id, 'attendees', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={activity.activityPerPerson}
                  onChange={(e) => updateTeamActivity(activity.id, 'activityPerPerson', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={activity.dinnerPerPerson}
                  onChange={(e) => updateTeamActivity(activity.id, 'dinnerPerPerson', e.target.value)}
                  placeholder="0"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => removeTeamActivity(activity.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addTeamActivity}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-semibold hover:underline"
          >
            + Add Team Activity
          </button>
        </div>

        <div className="mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Total T&E Cost: {formatCurrency(costs.tne)}</p>
        </div>
      </div>

      {/* Vendors Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">3. Vendor Costs</h3>
        <div className="space-y-2">
          {forecastData.vendors.map((vendor) => (
            <div key={vendor.id} className="flex gap-2">
              <input
                type="text"
                value={vendor.name}
                onChange={(e) => updateItem('vendors', vendor.id, 'name', e.target.value)}
                placeholder="Vendor Name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                value={vendor.cost}
                onChange={(e) => updateItem('vendors', vendor.id, 'cost', e.target.value)}
                placeholder="Cost ($)"
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => removeItem('vendors', vendor.id)}
                className="text-red-500 hover:text-red-700 font-bold text-2xl px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => addItem('vendors')}
          className="mt-2 text-sm text-gray-500 font-semibold hover:underline"
        >
          + Add Vendor
        </button>
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Vendor Cost: {formatCurrency(costs.vendors)}</p>
        </div>
      </div>

      {/* Consultants Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">4. Consultant Costs</h3>
        <div className="space-y-2">
          {forecastData.consultants.map((consultant) => (
            <div key={consultant.id} className="flex gap-2">
              <input
                type="text"
                value={consultant.name}
                onChange={(e) => updateItem('consultants', consultant.id, 'name', e.target.value)}
                placeholder="Consultant Name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                value={consultant.cost}
                onChange={(e) => updateItem('consultants', consultant.id, 'cost', e.target.value)}
                placeholder="Cost ($)"
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => removeItem('consultants', consultant.id)}
                className="text-red-500 hover:text-red-700 font-bold text-2xl px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => addItem('consultants')}
          className="mt-2 text-sm text-gray-500 font-semibold hover:underline"
        >
          + Add Consultant
        </button>
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Consultant Cost: {formatCurrency(costs.consultants)}</p>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default BudgetForecast;
