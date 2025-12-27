import { useState } from 'react'
import { BarChart3, DollarSign, Target, Plane, ClipboardList, Users, Sun, Moon } from 'lucide-react'
import { useTheme } from './contexts/ThemeContext'
import BudgetForecast from './components/BudgetForecast'
import BudgetAllocation from './components/BudgetAllocation'
import ROICalculator from './components/ROICalculator'
import TravelExpenses from './components/TravelExpenses'
import VendorTracker from './components/VendorTracker'
import HeadcountPlanning from './components/HeadcountPlanning'

function App() {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [activeModule, setActiveModule] = useState('vendor')

  const modules = [
    { id: 'vendor', name: 'Vendor Tracker', icon: ClipboardList },
    { id: 'travel', name: 'T&E Estimator', icon: Plane },
    { id: 'headcount', name: 'Headcount', icon: Users },
    { id: 'forecast', name: 'Budget Forecast', icon: BarChart3 },
    { id: 'roi', name: 'ROI Calculator', icon: Target },
    { id: 'allocation', name: 'Budget Allocation', icon: DollarSign },
  ]

  const renderModule = () => {
    switch (activeModule) {
      case 'vendor':
        return <VendorTracker />
      case 'travel':
        return <TravelExpenses />
      case 'headcount':
        return <HeadcountPlanning />
      case 'forecast':
        return <BudgetForecast />
      case 'roi':
        return <ROICalculator />
      case 'allocation':
        return <BudgetAllocation />
      default:
        return <VendorTracker />
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Financial Operations Hub
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Comprehensive budget planning and financial analysis tools
              </p>
            </div>
            <div className="flex items-center gap-3">
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors cursor-pointer
                    ${
                      activeModule === module.id
                        ? 'border-primary text-primary'
                        : isDarkMode
                          ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {module.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderModule()}
      </main>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-16`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            Design Operations Tools | 
            <a 
              href="https://www.linkedin.com/in/changyingz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              Contact
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
