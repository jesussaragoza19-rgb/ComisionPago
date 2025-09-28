// Pago Móvil Calculator JavaScript - Simplified Version
// Real-time commission calculator for Venezuelan mobile payments
// Uses fixed 0.30% commission rate

class PagoMovilCalculator {
    constructor() {
        // Fixed commission rate (0.30% for P2P)
        this.commissionRate = 0.003;
        this.currentAmount = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.updateResults();
    }
    
    initializeElements() {
        // Input elements
        this.amountInput = document.getElementById('amount-input');
        
        // Result elements
        this.originalAmountElement = document.getElementById('original-amount');
        this.commissionAmountElement = document.getElementById('commission-amount');
        this.totalAmountElement = document.getElementById('total-amount');
    }
    
    bindEvents() {
        // Amount input events for real-time calculation
        this.amountInput.addEventListener('input', (e) => {
            this.handleAmountChange(e.target.value);
        });
        
        this.amountInput.addEventListener('keyup', (e) => {
            this.handleAmountChange(e.target.value);
        });
    }
    
    handleAmountChange(value) {
        // Clean and validate input
        const cleanValue = this.cleanNumericInput(value);
        const numericValue = parseFloat(cleanValue) || 0;
        
        this.currentAmount = numericValue;
        this.updateResults();
        
        // Add visual feedback
        this.addUpdateAnimation();
    }
    
    cleanNumericInput(value) {
        // Remove any non-numeric characters except decimal point
        return value.replace(/[^\d.]/g, '');
    }
    
    calculateCommission(amount) {
        // Calculate commission using fixed 0.30% rate
        return Math.round(amount * this.commissionRate * 100) / 100;
    }
    
    formatCurrency(amount) {
        // Format number with thousands separator (dots) for Venezuelan formatting
        const rounded = Math.round(amount * 100) / 100;
        
        // Handle zero case
        if (rounded === 0) {
            return '0 Bs.';
        }
        
        const parts = rounded.toString().split('.');
        
        // Add dots as thousands separator
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        // Handle decimals - only show if not .00
        let formatted = parts[0];
        if (parts[1] && parts[1] !== '00') {
            formatted += ',' + parts[1];
        }
        
        return formatted + ' Bs.';
    }
    
    updateResults() {
        const amount = this.currentAmount;
        const commission = this.calculateCommission(amount);
        const total = amount + commission;
        
        // Update display elements
        this.originalAmountElement.textContent = this.formatCurrency(amount);
        this.commissionAmountElement.textContent = this.formatCurrency(commission);
        this.totalAmountElement.textContent = this.formatCurrency(total);
    }
    
    addUpdateAnimation() {
        // Add visual feedback when values update
        const resultValues = document.querySelectorAll('.result-value');
        resultValues.forEach(element => {
            element.classList.add('updating');
            setTimeout(() => {
                element.classList.remove('updating');
            }, 300);
        });
    }
    
    // Utility method for testing with the example
    runExample() {
        this.amountInput.value = '27000';
        this.currentAmount = 27000;
        this.updateResults();
    }
}

// Additional utility functions for better mobile UX
function setupMobileOptimizations() {
    const amountInput = document.getElementById('amount-input');
    
    // Prevent non-numeric input
    amountInput.addEventListener('keypress', function(e) {
        // Allow: backspace, delete, tab, escape, enter, decimal point
        if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    // Auto-focus on amount input for better UX (but not on mobile to avoid keyboard popup)
    setTimeout(() => {
        if (window.innerWidth > 768) {
            amountInput.focus();
        }
    }, 500);
    
    // Add touch feedback for mobile devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Prevent zoom on input focus for iOS
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            amountInput.addEventListener('focus', function() {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            });
            
            amountInput.addEventListener('blur', function() {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            });
        }
    }
    
    // Format input with thousands separator as user types (optional enhancement)
    amountInput.addEventListener('blur', function() {
        if (this.value && !isNaN(this.value)) {
            const numValue = parseFloat(this.value);
            if (numValue > 0) {
                // Format display value but keep actual numeric value
                const formatted = numValue.toLocaleString('es-VE', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });
                // Don't change the actual input value to avoid interfering with calculations
            }
        }
    });
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator
    const calculator = new PagoMovilCalculator();
    
    // Setup mobile optimizations
    setupMobileOptimizations();
    
    // Make calculator globally available for debugging/testing
    window.pagoMovilCalculator = calculator;
    
    // Add some helpful console logs for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Pago Móvil Calculator initialized');
        console.log('Commission rate: 0.30%');
        console.log('Try: pagoMovilCalculator.runExample() to test with 27,000 Bs.');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PagoMovilCalculator;
}