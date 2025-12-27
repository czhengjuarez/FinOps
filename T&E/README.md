README.md

# Team T&E Budget Estimator

A comprehensive web-based calculator for planning travel and entertainment costs for team events, offsites, and group activities.

## Features

- **Estimate Mode**: Calculate total costs from detailed inputs
  - Separate domestic vs. international flight costs
  - Per diem and travel allowances
  - Team activities and dinner budgets
  - Real-time cost breakdown

- **Budget Mode**: Work backwards from total budget
  - Determine affordable hotel nights within budget
  - Budget variance tracking (over/under)
  - Cost optimization recommendations

## Installation

1. Download all files to your web server directory
2. Ensure the following file structure:
   ```
   /te-estimator/
   ├── index.html
   ├── styles.css
   ├── script.js
   └── README.md
   ```
3. Open index.html in a web browser or upload to your web server

## File Structure

- `index.html` - Main calculator interface
- `styles.css` - All styling and responsive design (uses brand colors #8F1F57, #DD388B, #F5DEEA)
- `script.js` - Calculator functions and interactivity
- `README.md` - Documentation

## Customization

### Default Values
- Modify default input values in `index.html` to match your typical events
- Update room rates, flight costs, and per diem amounts for your region

### Branding
- Update footer links to point to your website
- Modify the color scheme in `styles.css` if needed
- Add your logo by updating the header section

### Calculations
- Customize calculation formulas in `script.js` if needed
- Add additional cost categories or modify existing ones

## Usage Tips

### Estimate Mode
- Input all known variables for your event
- Use the cost breakdown to understand where budget goes
- Adjust variables to see real-time cost changes

### Budget Mode
- Start with your total available budget
- Set fixed costs (flights, activities, allowances)
- See how many hotel nights you can afford
- Adjust parameters to optimize within budget

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- No external dependencies required

## License

Free to use and modify for personal and commercial projects.

---

deployment-guide.txt

T&E ESTIMATOR DEPLOYMENT GUIDE
==============================

Quick Setup:
1. Download all files (index.html, styles.css, script.js, README.md)
2. Create a folder called "te-estimator" on your web server
3. Upload all files to this folder
4. Access via: yourwebsite.com/te-estimator/

For WordPress:
1. Upload files to: /wp-content/themes/your-theme/te-estimator/
2. Create a new page with iframe or direct link
3. Or link directly to the calculator from your main site

For GitHub Pages:
1. Create a new repository called "te-estimator"
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Access via: yourusername.github.io/te-estimator

For Netlify:
1. Drag and drop the folder onto netlify.com
2. Get instant deployment with custom domain option

Customization Quick Start:
1. Update footer links in index.html (line ~XXX)
2. Modify default values to match your typical events
3. Add your branding/logo to header section
4. Customize colors in styles.css if needed

Usage Scenarios:
- Team offsite planning
- Conference travel budgeting
- Vendor negotiations with data
- Budget approval presentations
- Comparing venue/location costs

SEO Optimization:
- Add Google Analytics code before </head>
- Include meta tags for social sharing
- Submit to Google Search Console for indexing

The calculator is ready to use immediately after upload!