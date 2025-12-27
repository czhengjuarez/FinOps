import { useState } from 'react';
import { Plane } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AITravelOptimizer from './AITravelOptimizer';

const TravelExpenses = () => {
  const [activeMode, setActiveMode] = useState('estimate');

  return (
    <div className="space-y-6">
      {/* Module Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Plane className="w-6 h-6 text-primary" />
          T&E Budget Estimator
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Calculate travel and entertainment costs for team events, offsites, and group activities.
          Use Estimate Mode to calculate total costs, or Budget Mode to work backwards from a fixed budget.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">How to use:</p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-disc">
            <li><strong>Estimate Mode:</strong> Input event details to calculate total cost and per-person breakdown. Use this to export to Budget Forecast.</li>
            <li><strong>Budget Mode:</strong> Have a fixed budget? Start with your total budget amount and work backwards to determine what you can afford - optimal event duration, number of attendees, or adjust cost assumptions to fit within your budget constraints.</li>
            <li>Consider booking early (save 20-30%) and negotiating group rates (10+ rooms)</li>
            <li>Always add 10-15% buffer for unexpected costs</li>
          </ul>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveMode('estimate')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeMode === 'estimate'
                ? 'border-primary text-primary bg-gray-100 dark:bg-gray-700'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Estimate Mode
          </button>
          <button
            onClick={() => setActiveMode('budget')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeMode === 'budget'
                ? 'border-primary text-primary bg-gray-100 dark:bg-gray-700'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Budget Mode
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800">
          {activeMode === 'estimate' ? <EstimateMode /> : <BudgetMode />}
        </div>
      </div>
    </div>
  );
};

const EstimateMode = () => {
  const [inputs, setInputs] = useLocalStorage('tneEstimate', {
    location: 'San Francisco, CA',
    nights: 3,
    roomRate: 250,
    domesticTravelers: 8,
    internationalTravelers: 2,
    domesticFlight: 400,
    internationalFlight: 1200,
    perDiem: 75,
    travelAllowance: 150,
    activitiesBudget: 2000,
    teamDinners: 2,
    dinnerCost: 85,
  });

  const totalTravelers = inputs.domesticTravelers + inputs.internationalTravelers;
  const hotelCost = totalTravelers * inputs.nights * inputs.roomRate;
  const flightCost = inputs.domesticTravelers * inputs.domesticFlight + inputs.internationalTravelers * inputs.internationalFlight;
  const perDiemCost = totalTravelers * inputs.perDiem * (inputs.nights + 1);
  const travelAllowanceCost = totalTravelers * inputs.travelAllowance;
  const dinnerCost = totalTravelers * inputs.teamDinners * inputs.dinnerCost;
  const totalCost = hotelCost + flightCost + perDiemCost + travelAllowanceCost + inputs.activitiesBudget + dinnerCost;
  const costPerPerson = totalCost / totalTravelers;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Location</label>
              <input
                type="text"
                value={inputs.location}
                onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
                placeholder="City, State/Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Nights</label>
                <input
                  type="number"
                  value={inputs.nights}
                  onChange={(e) => setInputs({ ...inputs, nights: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Rate (per night)</label>
                <input
                  type="number"
                  value={inputs.roomRate}
                  onChange={(e) => setInputs({ ...inputs, roomRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domestic Travelers</label>
                <input
                  type="number"
                  value={inputs.domesticTravelers}
                  onChange={(e) => setInputs({ ...inputs, domesticTravelers: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">International Travelers</label>
                <input
                  type="number"
                  value={inputs.internationalTravelers}
                  onChange={(e) => setInputs({ ...inputs, internationalTravelers: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domestic Flight Cost (avg)</label>
                <input
                  type="number"
                  value={inputs.domesticFlight}
                  onChange={(e) => setInputs({ ...inputs, domesticFlight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">International Flight Cost (avg)</label>
                <input
                  type="number"
                  value={inputs.internationalFlight}
                  onChange={(e) => setInputs({ ...inputs, internationalFlight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Per Diem & Allowances</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Per Diem (per person)</label>
                <input
                  type="number"
                  value={inputs.perDiem}
                  onChange={(e) => setInputs({ ...inputs, perDiem: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Travel/Gas Allowance (per person)</label>
                <input
                  type="number"
                  value={inputs.travelAllowance}
                  onChange={(e) => setInputs({ ...inputs, travelAllowance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Activities Budget (total)</label>
              <input
                type="number"
                value={inputs.activitiesBudget}
                onChange={(e) => setInputs({ ...inputs, activitiesBudget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Dinners (count)</label>
                <input
                  type="number"
                  value={inputs.teamDinners}
                  onChange={(e) => setInputs({ ...inputs, teamDinners: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost per Person per Dinner</label>
                <input
                  type="number"
                  value={inputs.dinnerCost}
                  onChange={(e) => setInputs({ ...inputs, dinnerCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Estimated Cost</h4>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalCost)}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost per Person</h4>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(costPerPerson)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hotels</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(hotelCost)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Flights</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(flightCost)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Per Diem</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(perDiemCost)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Travel Allowance</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(travelAllowanceCost)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Activities</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(inputs.activitiesBudget)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dinners</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(dinnerCost)}</div>
          </div>
        </div>
      </div>

      {/* AI Travel Optimizer */}
      <AITravelOptimizer estimateData={{
        domesticTravelers: inputs.domesticTravelers,
        internationalTravelers: inputs.internationalTravelers,
        nights: inputs.nights,
        location: inputs.location,
        totalCost: totalCost,
        dates: undefined
      }} />
    </div>
  );
};

const BudgetMode = () => {
  const [inputs, setInputs] = useLocalStorage('tneBudget', {
    totalBudget: 25000,
    teamSize: 10,
    roomRate: 250,
    flightCost: 600,
    perDiem: 75,
    activitiesBudget: 3000,
    miscAllowances: 1500,
  });

  const fixedCosts = inputs.flightCost * inputs.teamSize + inputs.activitiesBudget + inputs.miscAllowances;
  const remainingForHotel = inputs.totalBudget - fixedCosts;
  const totalRoomNights = remainingForHotel / inputs.roomRate;
  const recommendedNights = Math.floor(totalRoomNights / inputs.teamSize);
  const perDiemCost = inputs.teamSize * inputs.perDiem * (recommendedNights + 1);
  const actualHotelCost = inputs.teamSize * recommendedNights * inputs.roomRate;
  const budgetVariance = inputs.totalBudget - (fixedCosts + actualHotelCost + perDiemCost);
  const costPerPerson = (inputs.totalBudget - budgetVariance) / inputs.teamSize;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Planning</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Available Budget</label>
              <input
                type="number"
                value={inputs.totalBudget}
                onChange={(e) => setInputs({ ...inputs, totalBudget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Team Members</label>
                <input
                  type="number"
                  value={inputs.teamSize}
                  onChange={(e) => setInputs({ ...inputs, teamSize: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Rate (per night)</label>
                <input
                  type="number"
                  value={inputs.roomRate}
                  onChange={(e) => setInputs({ ...inputs, roomRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avg Flight Cost (per person)</label>
                <input
                  type="number"
                  value={inputs.flightCost}
                  onChange={(e) => setInputs({ ...inputs, flightCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Per Diem (per person)</label>
                <input
                  type="number"
                  value={inputs.perDiem}
                  onChange={(e) => setInputs({ ...inputs, perDiem: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activities & Dinners Budget</label>
                <input
                  type="number"
                  value={inputs.activitiesBudget}
                  onChange={(e) => setInputs({ ...inputs, activitiesBudget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Misc/Travel Allowances</label>
                <input
                  type="number"
                  value={inputs.miscAllowances}
                  onChange={(e) => setInputs({ ...inputs, miscAllowances: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Analysis</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommended Hotel Nights</h4>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{recommendedNights} nights</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Remaining/Over</h4>
              <div className={`text-2xl font-bold ${budgetVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(budgetVariance)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost per Person (with recommended nights)</h4>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(costPerPerson)}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-gray-800 mb-1">Budget Planning Tips:</p>
              <p className="text-gray-700">
                Consider adjusting room rates, reducing activities budget, or limiting covered nights to stay within budget.
                Local accommodations or shared rooms can reduce costs significantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelExpenses;
