// script.js
// Data storage
let tools = [];
let vendors = [];

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

    // Update overview when switching to overview tab
    if (tabName === 'overview') {
        updateOverview();
    }
}

function toggleRenewalInfo(type) {
    const select = document.getElementById(type + '-type');
    const renewalInfo = document.getElementById(type + '-renewal-info');
    
    if (select.value === 'renewal') {
        renewalInfo.classList.add('show');
        setupRenewalCalculations(type);
    } else {
        renewalInfo.classList.remove('show');
    }
}

function setupRenewalCalculations(type) {
    const currentCostInput = document.getElementById(type + '-cost');
    const prevCostInput = document.getElementById(type + '-prev-cost');
    const increaseInput = document.getElementById(type + '-increase');
    const increasePercentInput = document.getElementById(type + '-increase-percent');

    function calculateIncrease() {
        const currentCost = parseFloat(currentCostInput.value) || 0;
        const prevCost = parseFloat(prevCostInput.value) || 0;
        
        if (prevCost > 0) {
            const increase = currentCost - prevCost;
            const increasePercent = ((increase / prevCost) * 100);
            
            increaseInput.value = increase.toFixed(2);
            increasePercentInput.value = increasePercent.toFixed(1);
        }
    }

    currentCostInput.addEventListener('input', calculateIncrease);
    prevCostInput.addEventListener('input', calculateIncrease);
}

function addTool() {
    const name = document.getElementById('tool-name').value;
    const type = document.getElementById('tool-type').value;
    const date = document.getElementById('tool-date').value;
    const cost = parseFloat(document.getElementById('tool-cost').value) || 0;
    const licenses = parseInt(document.getElementById('tool-licenses').value) || 1;
    const prevCost = parseFloat(document.getElementById('tool-prev-cost').value) || 0;

    if (!name || !date || cost <= 0) {
        alert('Please fill in all required fields');
        return;
    }

    const tool = {
        id: Date.now(),
        name,
        type,
        date,
        cost,
        licenses,
        prevCost: type === 'renewal' ? prevCost : 0,
        increase: type === 'renewal' ? cost - prevCost : 0,
        increasePercent: type === 'renewal' && prevCost > 0 ? ((cost - prevCost) / prevCost * 100) : 0
    };

    tools.push(tool);
    updateToolsList();
    clearToolForm();
}

function addVendor() {
    const name = document.getElementById('vendor-name').value;
    const service = document.getElementById('vendor-service').value;
    const date = document.getElementById('vendor-date').value;
    const cost = parseFloat(document.getElementById('vendor-cost').value) || 0;
    const duration = parseInt(document.getElementById('vendor-duration').value) || 12;
    const notes = document.getElementById('vendor-notes').value;

    if (!name || !date || cost <= 0) {
        alert('Please fill in all required fields');
        return;
    }

    const vendor = {
        id: Date.now(),
        name,
        service,
        date,
        cost,
        duration,
        monthlyRate: cost / duration,
        notes
    };

    vendors.push(vendor);
    updateVendorsList();
    clearVendorForm();
    
    // Update monthly rate display
    document.getElementById('vendor-monthly').value = vendor.monthlyRate.toFixed(2);
}

function updateToolsList() {
    const container = document.getElementById('tools-list');
    
    if (tools.length === 0) {
        container.innerHTML = '<p style="color: #718096; text-align: center; padding: 20px;">No tools added yet. Add your first tool to get started.</p>';
        return;
    }

    container.innerHTML = tools.map(tool => `
        <div class="vendor-item">
            <button class="delete-btn" onclick="deleteTool(${tool.id})">×</button>
            <h4>${tool.name}</h4>
            <div class="vendor-details">
                <span><strong>Type:</strong> ${tool.type === 'new' ? 'New Contract' : 'Renewal'}</span>
                <span><strong>Date:</strong> ${new Date(tool.date).toLocaleDateString()}</span>
                <span><strong>Annual Cost:</strong> $${tool.cost.toLocaleString()}</span>
                <span><strong>Licenses:</strong> ${tool.licenses}</span>
                ${tool.type === 'renewal' ? `
                    <span><strong>Previous Cost:</strong> $${tool.prevCost.toLocaleString()}</span>
                    <span><strong>Increase:</strong> $${tool.increase.toLocaleString()} (${tool.increasePercent.toFixed(1)}%)</span>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function updateVendorsList() {
    const container = document.getElementById('vendors-list');
    
    if (vendors.length === 0) {
        container.innerHTML = '<p style="color: #718096; text-align: center; padding: 20px;">No vendors added yet. Add your first vendor to get started.</p>';
        return;
    }

    container.innerHTML = vendors.map(vendor => `
        <div class="vendor-item">
            <button class="delete-btn" onclick="deleteVendor(${vendor.id})">×</button>
            <h4>${vendor.name}</h4>
            <div class="vendor-details">
                <span><strong>Service:</strong> ${vendor.service}</span>
                <span><strong>Start Date:</strong> ${new Date(vendor.date).toLocaleDateString()}</span>
                <span><strong>Contract Value:</strong> $${vendor.cost.toLocaleString()}</span>
                <span><strong>Duration:</strong> ${vendor.duration} months</span>
                <span><strong>Monthly Rate:</strong> $${vendor.monthlyRate.toLocaleString()}</span>
                ${vendor.notes ? `<span><strong>Notes:</strong> ${vendor.notes}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function updateOverview() {
    const totalTooling = tools.reduce((sum, tool) => sum + tool.cost, 0);
    const totalVendorCosts = vendors.reduce((sum, vendor) => sum + vendor.cost, 0);
    const totalBudget = totalTooling + totalVendorCosts;
    const monthlyAverage = totalBudget / 12;

    document.getElementById('total-tooling').textContent = '$' + totalTooling.toLocaleString();
    document.getElementById('total-vendors').textContent = '$' + totalVendorCosts.toLocaleString();
    document.getElementById('total-budget').textContent = '$' + totalBudget.toLocaleString();
    document.getElementById('monthly-average').textContent = '$' + monthlyAverage.toLocaleString();
}

function deleteTool(id) {
    tools = tools.filter(tool => tool.id !== id);
    updateToolsList();
    updateOverview();
}

function deleteVendor(id) {
    vendors = vendors.filter(vendor => vendor.id !== id);
    updateVendorsList();
    updateOverview();
}

function clearToolForm() {
    document.getElementById('tool-name').value = '';
    document.getElementById('tool-type').value = 'new';
    document.getElementById('tool-date').value = '';
    document.getElementById('tool-cost').value = '';
    document.getElementById('tool-licenses').value = '1';
    document.getElementById('tool-prev-cost').value = '';
    document.getElementById('tool-increase').value = '';
    document.getElementById('tool-increase-percent').value = '';
    document.getElementById('tool-renewal-info').classList.remove('show');
}

function clearVendorForm() {
    document.getElementById('vendor-name').value = '';
    document.getElementById('vendor-service').value = 'Design Consulting';
    document.getElementById('vendor-date').value = '';
    document.getElementById('vendor-cost').value = '';
    document.getElementById('vendor-duration').value = '';
    document.getElementById('vendor-monthly').value = '';
    document.getElementById('vendor-notes').value = '';
}

function exportToCSV(type) {
    let csvContent = '';
    let filename = '';

    if (type === 'tools' || type === 'combined') {
        csvContent += 'Tool Name,Contract Type,Start/Renewal Date,Annual Cost,Licenses,Previous Cost,Increase Amount,Increase Percentage\n';
        tools.forEach(tool => {
            csvContent += `"${tool.name}","${tool.type}","${tool.date}","${tool.cost}","${tool.licenses}","${tool.prevCost}","${tool.increase}","${tool.increasePercent}%"\n`;
        });
        
        if (type === 'combined') {
            csvContent += '\n\nVendor Name,Service Type,Start Date,Contract Value,Duration (months),Monthly Rate,Notes\n';
        }
    }

    if (type === 'vendors' || type === 'combined') {
        if (type === 'vendors') {
            csvContent += 'Vendor Name,Service Type,Start Date,Contract Value,Duration (months),Monthly Rate,Notes\n';
        }
        vendors.forEach(vendor => {
            csvContent += `"${vendor.name}","${vendor.service}","${vendor.date}","${vendor.cost}","${vendor.duration}","${vendor.monthlyRate}","${vendor.notes}"\n`;
        });
    }

    filename = type === 'combined' ? 'vendor_budget_tracker.csv' : `${type}_budget.csv`;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Auto-calculate vendor monthly rate
document.getElementById('vendor-cost').addEventListener('input', function() {
    const cost = parseFloat(this.value) || 0;
    const duration = parseInt(document.getElementById('vendor-duration').value) || 12;
    document.getElementById('vendor-monthly').value = (cost / duration).toFixed(2);
});

document.getElementById('vendor-duration').addEventListener('input', function() {
    const cost = parseFloat(document.getElementById('vendor-cost').value) || 0;
    const duration = parseInt(this.value) || 12;
    document.getElementById('vendor-monthly').value = (cost / duration).toFixed(2);
});

// Initialize
updateOverview();