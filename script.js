
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['basicPay', 'allowances', 'statutory'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculateAll);
        }
    });
    calculateAll();
    const allLinks = document.querySelectorAll('.disabled-link');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            this.classList.add('clicked');

            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);

            console.log('Link clicked:', this.textContent.trim());
        });
    });

    const menuItems = document.querySelectorAll('.has-submenu > a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            if (window.innerWidth <= 768) {
                const submenu = this.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.style.display = 
                        submenu.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
    });
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Search functionality disabled in demo');
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 300);
        });
    }
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Login disabled in demo');
        });
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.submenu').forEach(menu => {
                menu.style.display = '';
            });
        }
    });
});
function calculateAll() {
    const basic = parseFloat(document.getElementById('basicPay')?.value) || 0;
    const allowances = parseFloat(document.getElementById('allowances')?.value) || 0;
    const statutory = parseFloat(document.getElementById('statutory')?.value) || 0;

    const gross = basic + allowances;

    const napsa = Math.min(gross * 0.05, 1500);

    const nhima = 0;

    const taxable = Math.max(0, gross - napsa - statutory);

    const tax = calculatePAYE(taxable);
    
    const totalContributions = napsa + nhima;
    const totalTax = tax;
    const totalDeductions = totalContributions + totalTax;
    const net = gross - totalDeductions;

    updateDisplay('grossPay', gross);
    updateDisplay('napsa', napsa);
    updateDisplay('nhima', nhima);
    updateDisplay('totalContributions', totalContributions);
    updateDisplay('totalTax', totalTax);
    updateDisplay('totalDeductions', totalDeductions);
    updateDisplay('netSalary', net);
    
    updateTaxBands(taxable, tax);
}

function calculatePAYE(income) {
    if (income <= 5100) return 0;
    
    let tax = 0;
    let remaining = income - 5100;
    
    let band2 = Math.min(remaining, 4100);
    tax += band2 * 0.20;
    remaining -= band2;
    
    if (remaining > 0) {
        let band3 = Math.min(remaining, 4400);
        tax += band3 * 0.30;
        remaining -= band3;
    }
    
    if (remaining > 0) {
        tax += remaining * 0.37;
    }
    
    return tax;
}

function updateTaxBands(income, totalTax) {
    let remaining = Math.max(0, income - 5100);
    
    let band1 = Math.min(income, 5100);
    let band2 = Math.min(remaining, 4100);
    let band3 = Math.min(Math.max(remaining - 4100, 0), 4400);
    let band4 = Math.max(remaining - 8500, 0);
    
    let tax2 = band2 * 0.20;
    let tax3 = band3 * 0.30;
    let tax4 = band4 * 0.37;
    
    const chargeable1 = document.getElementById('chargeable1');
    const chargeable2 = document.getElementById('chargeable2');
    const chargeable3 = document.getElementById('chargeable3');
    const chargeable4 = document.getElementById('chargeable4');
    const taxDue1 = document.getElementById('taxDue1');
    const taxDue2 = document.getElementById('taxDue2');
    const taxDue3 = document.getElementById('taxDue3');
    const taxDue4 = document.getElementById('taxDue4');
    
    if (chargeable1) chargeable1.textContent = band1.toFixed(2);
    if (chargeable2) chargeable2.textContent = band2.toFixed(2);
    if (chargeable3) chargeable3.textContent = band3.toFixed(2);
    if (chargeable4) chargeable4.textContent = band4.toFixed(2);
    
    if (taxDue1) taxDue1.textContent = '0.00';
    if (taxDue2) taxDue2.textContent = tax2.toFixed(2);
    if (taxDue3) taxDue3.textContent = tax3.toFixed(2);
    if (taxDue4) taxDue4.textContent = tax4.toFixed(2);
}

function updateDisplay(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = 'K ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

window.resetCalculator = function() {
    const basicPay = document.getElementById('basicPay');
    const allowances = document.getElementById('allowances');
    const statutory = document.getElementById('statutory');
    
    if (basicPay) basicPay.value = '0';
    if (allowances) allowances.value = '0';
    if (statutory) statutory.value = '0';
    
    calculateAll();
};

window.addEventListener('scroll', function() {
    const header = document.querySelector('.stm-header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
});