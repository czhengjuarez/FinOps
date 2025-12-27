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

function calculateEstimate() {
    const nights = parseInt(document.getElementById('nights').value) || 0;
    const roomRate = parseFloat(document.getElementById('room-rate').value) || 0;
    const domesticTravelers = parseInt(document.getElementById('domestic-travelers').value) || 0;
    const internationalTravelers = parseInt(document.getElementById('international-travelers').value) || 0;
    const domesticFlight = parseFloat(document.getElementById('domestic-flight').value) || 0;
    const internationalFlight = parseFloat(document.getElementById('international-flight').value) || 0;
    const perDiem = parseFloat(document.getElementById('per-diem').value) || 0;
    const travelAllowance = parseFloat(document.getElementById('travel-allowance').value) || 0;
    const activitiesBudget = parseFloat(document.getElementById('activities-budget').value) || 0;
    const teamDinners = parseInt(document.getElementById('team-dinners').value) || 0;
    const dinnerCost = parseFloat(document.getElementById('dinner-cost').value) || 0;

    const totalTravelers = domesticTravelers + internationalTravelers;

    // Calculate costs
    const hotelCosts = totalTravelers * nights * roomRate;
    const flightCosts = (domesticTravelers * domesticFlight) + (internationalTravelers * internationalFlight);
    const perDiemCosts = totalTravelers * nights * perDiem;
    const travelAllowanceCosts = totalTravelers * travelAllowance;
    const dinnerCosts = totalTravelers * teamDinners * dinnerCost;

    const totalCost = hotelCosts + flightCosts + perDiemCosts + travelAllowanceCosts + activitiesBudget + dinnerCosts;
    const costPerPerson = totalTravelers > 0 ? totalCost / totalTravelers : 0;

    // Update display
    document.getElementById('total-estimate').textContent = '$' + totalCost.toLocaleString();
    document.getElementById('cost-per-person').textContent = '$' + costPerPerson.toLocaleString();

    // Update breakdown
    const breakdown = document.getElementById('cost-breakdown');
    breakdown.innerHTML = `
        <div class="breakdown-item">
            <span>Hotel (${totalTravelers} people × ${nights} nights × $${roomRate})</span>
            <span>$${hotelCosts.toLocaleString()}</span>
        </div>
        <div class="breakdown-item">
            <span>Flights (${domesticTravelers} domestic + ${internationalTravelers} international)</span>
            <span>$${flightCosts.toLocaleString()}</span>
        </div>
        <div class="breakdown-item">
            <span>Per Diem (${totalTravelers} people × ${nights} days × $${perDiem})</span>
            <span>$${perDiemCosts.toLocaleString()}</span>
        </div>
        <div class="breakdown-item">
            <span>Travel Allowances (${totalTravelers} people × $${travelAllowance})</span>
            <span>$${travelAllowanceCosts.toLocaleString()}</span>
        </div>
        <div class="breakdown-item">
            <span>Team Activities</span>
            <span>$${activitiesBudget.toLocaleString()}</span>
        </div>
        <div class="breakdown-item">
            <span>Team Dinners (${teamDinners} dinners × ${totalTravelers} people × $${dinnerCost})</span>
            <span>$${dinnerCosts.toLocaleString()}</span>
        </div>
        <div class="breakdown-item">
            <span><strong>Total Estimated Cost</strong></span>
            <span><strong>$${totalCost.toLocaleString()}</strong></span>
        </div>
    `;
}

function calculateBudgetMode() {
    const totalBudget = parseFloat(document.getElementById('total-budget').value) || 0;
    const teamSize = parseInt(document.getElementById('budget-team-size').value) || 1;
    const roomRate = parseFloat(document.getElementById('budget-room-rate').value) || 0;
    const flightCost = parseFloat(document.getElementById('budget-flight-cost').value) || 0;
    const perDiem = parseFloat(document.getElementById('budget-per-diem').value) || 0;
    const activitiesBudget = parseFloat(document.getElementById('budget-activities').value) || 0;
    const miscBudget = parseFloat(document.getElementById('budget-misc').value) || 0;

    // Calculate fixed costs
    const flightCosts = teamSize * flightCost;
    const fixedCosts = flightCosts + activitiesBudget + miscBudget;
    
    // Remaining budget for hotel and per diem
    const remainingBudget = totalBudget - fixedCosts;
    
    // Calculate hotel nights that fit in remaining budget
    const dailyCostPerPerson = roomRate + perDiem;
    const totalDailyCost = teamSize * dailyCostPerPerson;
    
    const affordableNights = totalDailyCost > 0 ? Math.floor(remainingBudget / totalDailyCost) : 0;
    
    // Calculate actual cost with recommended nights
    const actualHotelCost = teamSize * affordableNights * roomRate;
    const actualPerDiemCost = teamSize * affordableNights * perDiem;
    const actualTotalCost = fixedCosts + actualHotelCost + actualPerDiemCost;
    
    const budgetVariance = totalBudget - actualTotalCost;
    const costPerPerson = actualTotalCost / teamSize;

    // Update display
    document.getElementById('recommended-nights').textContent = affordableNights + ' nights';
    document.getElementById('budget-variance').textContent = (budgetVariance >= 0 ? '+$' : '-$') + Math.abs(budgetVariance).toLocaleString();
    document.getElementById('budget-variance').className = 'result-value ' + (budgetVariance >= 0 ? 'budget-under' : 'budget-over');
    document.getElementById('budget-cost-per-person').textContent = '$' + costPerPerson.toLocaleString();
}

// Initialize calculations when page loads
document.addEventListener('DOMContentLoaded', function() {
    calculateEstimate();
    calculateBudgetMode();
});