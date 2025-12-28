# Financial Operations Hub

A comprehensive web-based financial planning and analysis tool designed for design operations teams to manage budgets, forecast expenses, and track year-over-year changes. Enhanced with AI-powered insights using Cloudflare Workers AI.

## 🎯 Purpose

The Financial Operations Hub streamlines the budget planning process by providing an integrated platform to:
- Plan and forecast annual team budgets across multiple cost categories
- Import and consolidate data from various expense sources
- Track year-over-year budget changes and trends
- Calculate ROI for design operations initiatives with AI analysis
- Get AI-powered travel optimization and strategic insights
- Export detailed reports for stakeholder presentations

This tool is specifically designed for design operations managers, finance teams, and department heads who need to justify budget requests and demonstrate financial planning rigor.

## 🌐 Live Demo

**Production URL**: https://finops.coscient.workers.dev

Deployed on Cloudflare Workers with edge computing for fast global access.

## ✨ Key Features

### 1. **Budget Forecast**
The central hub for comprehensive budget planning:
- **Headcount Planning**: Calculate total compensation costs including salary and benefits
- **Travel & Expenses (T&E)**: Track individual trips, team get-togethers, and team activities
- **Vendor Costs**: Manage tooling subscriptions and vendor contracts
- **Consultant Costs**: Track consultant engagements and contract values
- **Data Import**: Pull calculated totals from other modules to auto-populate forecasts
- **Year-over-Year Comparison**: Compare current forecast against previous year actuals
- **Imported Data Summary**: Visual display of all imported data sources
- **CSV Export**: Export complete forecast for presentations and reporting

### 2. **Vendor Tracker**
Dual-tab system for managing vendor relationships:
- **Tooling Tab**: Track software subscriptions and tool licenses
  - Monitor renewal dates and cost increases
  - Calculate annual costs and per-license pricing
  - Track new purchases vs. renewals
- **Vendors & Consultants Tab**: Manage service contracts
  - Track contract values and duration
  - Calculate monthly rates
  - Document service types and notes
- **Separate Exports**: Export tools and vendors to separate CSV files

### 3. **Travel & Expense Estimator**
Two-mode system for T&E planning:
- **Estimate Mode**: Calculate total event costs from detailed inputs
  - Domestic and international traveler counts
  - Flight, hotel, and per diem calculations
  - Team dinners and activities budgeting
  - Per-person cost breakdowns
- **Budget Mode**: Work backwards from fixed budget constraints
  - Determine optimal event parameters within budget
  - Adjust attendee counts and duration to fit budget
  - Identify cost-saving opportunities
- **Export to Budget Forecast**: One-click import of estimates

### 4. **Headcount Planning**
Professional-level workforce planning:
- **Predefined Levels**: P1-P6 (Individual Contributors) and M1-M6 (Management)
- **Custom Levels**: Add organization-specific job levels
- **Compensation Tracking**: Base salary, equity, and benefits per level
- **Benefits Rate Configuration**: Set employer benefits and tax rate (25-35% typical)
- **Headcount by Level**: Plan team composition across levels
- **Total Cost Calculation**: Automatic aggregation of all compensation costs
- **Export Functionality**: Export headcount plan to CSV

### 5. **ROI Calculator**
Quantify the value of design operations initiatives:
- **Time Savings**: Calculate hours saved and dollar value
- **Quality Improvements**: Measure defect reduction and rework savings
- **Efficiency Gains**: Track process improvements and cost reductions
- **Total ROI**: Automatic calculation of return on investment
- **Payback Period**: Determine how quickly investments pay for themselves
- **AI ROI Analyzer** 🤖: Get AI-powered insights on your ROI calculations
  - Industry benchmark comparisons
  - Risk factor analysis
  - Strategic recommendations
  - Custom question prompts for specific analysis

### 6. **Budget Allocation**
Visualize and plan budget distribution:
- **Category Breakdown**: Allocate budget across major categories
- **Visual Charts**: Pie chart visualization of budget allocation
- **Percentage Tracking**: Monitor allocation percentages
- **Total Budget Management**: Ensure allocations sum to 100%

### 7. **AI-Powered Features** 🤖
Leverage Cloudflare Workers AI for intelligent insights:
- **AI Travel Optimizer**: Get cost-saving recommendations for team events
  - Venue suggestions and cost optimization
  - Attendance and duration recommendations
  - Budget allocation strategies
- **AI ROI Analyzer**: Deep analysis of ROI calculations
  - Industry benchmarks and comparisons
  - Risk assessment and mitigation strategies
  - Custom question support for targeted insights
- **AI Strategic Advisor**: High-level budget strategy insights
  - Budget allocation recommendations
  - Year-over-year trend analysis
  - Strategic planning guidance
  - Custom questions for specific scenarios

## 🛠️ Tech Stack

### Frontend Framework
- **React 18**: Modern React with functional components and hooks
- **Vite**: Fast build tool and development server

### Backend & AI
- **Cloudflare Workers**: Serverless edge computing platform
- **Cloudflare Workers AI**: AI inference at the edge
  - Model: `@cf/meta/llama-3.1-8b-instruct`
  - Features: Travel optimization, ROI analysis, strategic insights
- **Wrangler**: Cloudflare Workers CLI and deployment tool

### Styling & UI
- **Tailwind CSS v3**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **CSS Variables**: Dynamic theming for dark mode support
- **Dark Mode**: Full dark mode support with automatic detection

### State Management
- **React Hooks**: useState for component state
- **Custom Hooks**: useLocalStorage for persistent data storage
- **LocalStorage**: Client-side data persistence

### Data Handling
- **JSON**: Data serialization and storage format
- **CSV Export**: Custom CSV generation utility
- **Data Migration**: Automatic schema migration for backward compatibility

### Development Tools
- **ESLint**: Code linting and quality checks
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefix handling

## 📁 Project Structure

```
FinancialOps/
├── src/
│   └── index.js                        # Cloudflare Worker (AI API endpoints)
├── app/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BudgetForecast.jsx      # Main budget planning module
│   │   │   ├── VendorTracker.jsx       # Vendor and tooling management
│   │   │   ├── TravelExpenses.jsx      # T&E estimation and planning
│   │   │   ├── HeadcountPlanning.jsx   # Workforce planning
│   │   │   ├── ROICalculator.jsx       # ROI analysis tool
│   │   │   ├── BudgetAllocation.jsx    # Budget distribution
│   │   │   ├── AITravelOptimizer.jsx   # AI travel recommendations
│   │   │   ├── AIROIAnalyzer.jsx       # AI ROI analysis
│   │   │   └── AIStrategicInsights.jsx # AI strategic advisor
│   │   ├── hooks/
│   │   │   └── useLocalStorage.js      # Persistent storage hook
│   │   ├── utils/
│   │   │   ├── formatters.js           # Currency and percentage formatting
│   │   │   ├── exportCSV.js            # CSV export utility
│   │   │   └── aiService.js            # AI API client
│   │   ├── App.jsx                     # Main application component
│   │   ├── index.css                   # Global styles and CSS variables
│   │   └── main.jsx                    # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── wrangler.toml                       # Cloudflare Workers configuration
└── README.md
```

## 🎨 Design Features

### Dark Mode Support
- Automatic dark mode detection
- Manual toggle for user preference
- Consistent color scheme using CSS variables
- Optimized contrast for readability

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements
- Responsive grid systems

### User Experience
- Intuitive navigation with icon-based tabs
- Real-time calculations and updates
- Confirmation dialogs for destructive actions
- Visual feedback for imported data
- Consistent styling across all modules

## 💾 Data Persistence

All data is stored locally in the browser using LocalStorage:
- **budgetForecast**: Main forecast data
- **budgetForecastPrevYear**: Previous year actuals
- **budgetForecastImported**: Import tracking flags
- **headcountLevelsV2**: Headcount planning data
- **headcountBenefitsRate**: Benefits and tax rate configuration
- **tneEstimate**: T&E estimate mode data
- **travelExpenses**: T&E budget mode data
- **vendorTools**: Tooling subscriptions
- **vendorConsultants**: Vendor contracts

### Data Migration
Automatic migration logic handles schema changes:
- Converts old object formats to new array formats
- Adds missing fields with default values
- Maintains backward compatibility
- No data loss during updates

### AI Features
AI features require no additional configuration:
- All AI processing happens on Cloudflare's edge network
- No API keys required for end users
- Responses are generated in real-time
- No user data is stored on servers

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FinancialOps
```

2. Install frontend dependencies:
```bash
cd app
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Cloudflare Workers Deployment

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Build the frontend:
```bash
cd app
npm run build
cd ..
```

4. Deploy to Cloudflare Workers:
```bash
wrangler deploy
```

The app will be deployed to your Cloudflare Workers subdomain with AI features enabled.

### Local Development with Workers

```bash
# Build frontend
cd app && npm run build && cd ..

# Start Workers dev server
wrangler dev
```

This starts a local server with AI features at `http://localhost:8787`

## 📊 Usage Guide

### Basic Workflow

1. **Start with Headcount Planning**
   - Define your team structure and compensation
   - Calculate total headcount costs
   - Export for reference

2. **Plan Travel & Expenses**
   - Use Estimate Mode to calculate event costs
   - Or use Budget Mode to work within constraints
   - Import totals to Budget Forecast

3. **Track Vendor Costs**
   - Add all tooling subscriptions
   - Document vendor contracts
   - Import to Budget Forecast

4. **Create Budget Forecast**
   - Import data from other modules OR enter manually
   - Add previous year actuals for comparison
   - Review imported data summary
   - Export complete forecast

5. **Calculate ROI** (Optional)
   - Quantify value of initiatives
   - Justify budget increases
   - Track efficiency gains

6. **Allocate Budget** (Optional)
   - Visualize budget distribution
   - Plan category allocations
   - Ensure balanced spending

### Import Workflow

The Budget Forecast module can import from:
- **Headcount Tab**: Total compensation costs
- **T&E Tab**: Total travel and expense estimates
- **Vendor Tab**: 
  - Tooling costs (from Tools section)
  - Vendor & Consultant costs (from Vendors section)

Imported data appears in the "Imported Data Summary" section with source attribution.

## 🎯 Use Cases

### For Design Operations Managers
- Plan annual team budgets with confidence
- Justify headcount requests with detailed compensation analysis
- Track vendor spend and identify cost optimization opportunities
- Demonstrate ROI of design operations initiatives

### For Finance Teams
- Receive detailed, well-structured budget forecasts
- Compare year-over-year changes with clear attribution
- Export data for financial planning systems
- Audit budget assumptions and calculations

### For Department Heads
- Understand total cost of design operations
- Make informed decisions about team growth
- Allocate resources across categories
- Present budget requests to leadership

## 🔒 Privacy & Security

- **No Server**: All data stays in your browser
- **No Tracking**: No analytics or user tracking
- **No Login**: No authentication required
- **Local Storage**: Data persists only on your device
- **Export Control**: You control all data exports

## 🤝 Contributing

This is a personal project designed for design operations teams. Feel free to fork and customize for your organization's needs.

## 📝 License

This project is available for personal and commercial use.

## 👤 Contact

**Changying Zheng**
- LinkedIn: [linkedin.com/in/changyingz](https://www.linkedin.com/in/changyingz/)

## 🙏 Acknowledgments

Built with modern web technologies and best practices for financial planning and analysis in design operations.

---

## 🆕 Recent Updates (December 2025)

### AI Features
- ✅ Added AI Travel Optimizer with cost-saving recommendations
- ✅ Added AI ROI Analyzer with industry benchmarks and risk analysis
- ✅ Added AI Strategic Advisor for budget planning insights
- ✅ Custom question prompts for targeted AI analysis
- ✅ Deployed on Cloudflare Workers with edge AI inference

### UX Improvements
- ✅ Benefits rate configuration in Headcount Planning tab
- ✅ Benefits rate imported from Headcount to Budget Forecast
- ✅ Fixed dark mode label visibility across all pages
- ✅ Improved calculation robustness with null checks
- ✅ Fixed T&E import double-counting bug

### Technical Enhancements
- ✅ Migrated to Cloudflare Workers for global edge deployment
- ✅ Integrated Cloudflare Workers AI (Llama 3.1 8B)
- ✅ Optimized AI prompts to prevent response truncation
- ✅ Enhanced error handling and logging for AI features

---

**Version**: 2.0.0  
**Last Updated**: December 27, 2025
