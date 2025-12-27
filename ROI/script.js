// script.js
function showTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

function calculateDesignSystem() {
    const designers = parseInt(document.getElementById('ds-designers').value) || 0;
    const hourlyRate = parseFloat(document.getElementById('ds-hourly-rate').value) || 0;
    const componentHours = parseFloat(document.getElementById('ds-component-hours').value) || 0;
    const implementationCost = parseFloat(document.getElementById('ds-implementation-cost').value) || 0;
    const efficiencyGain = parseFloat(document.getElementById('ds-efficiency-gain').value) || 0;

    const weeklyTimeSaved = designers * componentHours * (efficiencyGain / 100);
    const annualSavings = weeklyTimeSaved * 52 * hourlyRate;
    const paybackMonths = implementationCost / (annualSavings / 12);
    const threeYearROI = ((annualSavings * 3 - implementationCost) / implementationCost) * 100;

    document.getElementById('ds-annual-savings').textContent = '$' + annualSavings.toLocaleString();
    document.getElementById('ds-payback-period').textContent = paybackMonths.toFixed(1) + ' months';
    document.getElementById('ds-three-year-roi').textContent = threeYearROI.toFixed(0) + '%';
    document.getElementById('ds-three-year-roi').className = 'result-value ' + (threeYearROI > 0 ? 'roi-positive' : 'roi-negative');
}

function calculateTooling() {
    const users = parseInt(document.getElementById('tool-users').value) || 0;
    const annualCost = parseFloat(document.getElementById('tool-annual-cost').value) || 0;
    const timeSaved = parseFloat(document.getElementById('tool-time-saved').value) || 0;
    const hourlyRate = parseFloat(document.getElementById('tool-hourly-rate').value) || 0;
    const setupCost = parseFloat(document.getElementById('tool-setup-cost').value) || 0;

    const annualSavings = users * timeSaved * 52 * hourlyRate;
    const totalCost = annualCost + setupCost;
    const annualROI = ((annualSavings - totalCost) / totalCost) * 100;

    document.getElementById('tool-annual-savings').textContent = '$' + annualSavings.toLocaleString();
    document.getElementById('tool-total-cost').textContent = '$' + totalCost.toLocaleString();
    document.getElementById('tool-annual-roi').textContent = annualROI.toFixed(0) + '%';
    document.getElementById('tool-annual-roi').className = 'result-value ' + (annualROI > 0 ? 'roi-positive' : 'roi-negative');
}

function calculateHeadcount() {
    const currentCount = parseInt(document.getElementById('hc-current-count').value) || 0;
    const projectsQueue = parseInt(document.getElementById('hc-projects-queue').value) || 0;
    const projectDuration = parseFloat(document.getElementById('hc-project-duration').value) || 0;
    const desiredTimeline = parseFloat(document.getElementById('hc-desired-timeline').value) || 0;
    const designerCost = parseFloat(document.getElementById('hc-designer-cost').value) || 0;
    const revenuePerProject = parseFloat(document.getElementById('hc-revenue-per-project').value) || 0;

    const totalProjectWeeks = projectsQueue * projectDuration;
    const currentCapacity = currentCount * desiredTimeline;
    const requiredDesigners = Math.ceil(totalProjectWeeks / desiredTimeline);
    const additionalHires = Math.max(0, requiredDesigners - currentCount);
    const investmentImpact = (additionalHires * designerCost) - (projectsQueue * revenuePerProject);

    document.getElementById('hc-recommended-size').textContent = requiredDesigners + ' designers';
    document.getElementById('hc-additional-hires').textContent = additionalHires + ' designers';
    document.getElementById('hc-investment-impact').textContent = '$' + Math.abs(investmentImpact).toLocaleString() + (investmentImpact < 0 ? ' revenue gain' : ' investment cost');
}

function calculateBudget() {
    const totalBudget = parseFloat(document.getElementById('budget-total').value) || 0;
    const headcountPercent = parseFloat(document.getElementById('budget-headcount-percent').value) || 0;
    const toolsPercent = parseFloat(document.getElementById('budget-tools-percent').value) || 0;
    const trainingPercent = parseFloat(document.getElementById('budget-training-percent').value) || 0;
    const opsPercent = parseFloat(document.getElementById('budget-ops-percent').value) || 0;

    const headcountAmount = totalBudget * (headcountPercent / 100);
    const toolsAmount = totalBudget * (toolsPercent / 100);
    const trainingAmount = totalBudget * (trainingPercent / 100);
    const opsAmount = totalBudget * (opsPercent / 100);
    const totalAllocated = headcountAmount + toolsAmount + trainingAmount + opsAmount;

    document.getElementById('budget-headcount-amount').textContent = '$' + headcountAmount.toLocaleString();
    document.getElementById('budget-tools-amount').textContent = '$' + toolsAmount.toLocaleString();
    document.getElementById('budget-training-amount').textContent = '$' + trainingAmount.toLocaleString();
    document.getElementById('budget-ops-amount').textContent = '$' + opsAmount.toLocaleString();
    document.getElementById('budget-total-allocated').textContent = '$' + totalAllocated.toLocaleString();
}

// Initialize calculations when page loads
document.addEventListener('DOMContentLoaded', function() {
    calculateDesignSystem();
    calculateTooling();
    calculateHeadcount();
    calculateBudget();
});