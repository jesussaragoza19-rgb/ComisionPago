// Pago Móvil Calculator JavaScript - Con AdMob integrado
// Real-time commission calculator for Venezuelan mobile payments
// Uses fixed 0.30% commission rate

class PagoMovilCalculator {
    constructor() {
        // Fixed commission rate (0.30% for P2P)
        this.commissionRate = 0.003;
        this.currentAmount = 0;
        this.calculationCount = 0; // Para controlar anuncios intersticiales
        
        this.initializeElements();
        this.bindEvents();
        this.updateResults();
        this.initializeAds();
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
        
        // Incrementar contador de cálculos para anuncios intersticiales
        if (numericValue > 0) {
            this.calculationCount++;
            this.checkForInterstitialAd();
        }
        
        // Add visual feedback
        this.addUpdateAnimation();
    }
    
    cleanNumericInput(value) {
        // Remove any non-numeric characters except decimal point
        return value.replace(/[^\\d.]/g, '');
    }
    
    calculateCommission(amount) {
        // Calculate commission using fixed 0.30% rate
        return Math.round(amount * this.commissionRate * 100) / 100;
    }
    
    formatCurrency(amount) {
        // Format number with thousands separator (dots) for Venezuelan formatting
        const rounded = Math.round(amount * 100) / 100;
        return rounded.toLocaleString('es-VE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).replace(/,/g, '.') + ' Bs.';
    }
    
    updateResults() {
        const commission = this.calculateCommission(this.currentAmount);
        const total = this.currentAmount + commission;
        
        // Update display elements
        this.originalAmountElement.textContent = this.formatCurrency(this.currentAmount);
        this.commissionAmountElement.textContent = this.formatCurrency(commission);
        this.totalAmountElement.textContent = this.formatCurrency(total);
        
        // Update page title dynamically
        if (this.currentAmount > 0) {
            document.title = `${this.formatCurrency(total)} - Calculadora Pago Móvil`;
        } else {
            document.title = 'Calculadora Pago Móvil - Venezuela';
        }
    }
    
    addUpdateAnimation() {
        // Add subtle animation feedback
        const resultsCard = document.querySelector('.results-card');
        if (resultsCard) {
            resultsCard.style.transform = 'scale(1.02)';
            resultsCard.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                resultsCard.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    // FUNCIONES ADMOB CON TUS CÓDIGOS
    initializeAds() {
        // Inicializar AdMob cuando esté disponible
        if (typeof adsbygoogle !== 'undefined') {
            console.log('AdMob initialized with your account');
        }
        
        // Crear contenedor para anuncio intersticial (invisible inicialmente)
        this.createInterstitialContainer();
    }
    
    createInterstitialContainer() {
        // Crear contenedor para anuncio intersticial
        const interstitialContainer = document.createElement('div');
        interstitialContainer.id = 'interstitial-ad-container';
        interstitialContainer.className = 'interstitial-container';
        interstitialContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        `;
        
        // Botón para cerrar
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            z-index: 10001;
        `;
        closeButton.onclick = () => this.closeInterstitial();
        
        // Anuncio intersticial con TU CÓDIGO
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.cssText = 'display:block; width: 300px; height: 250px;';
        adElement.setAttribute('data-ad-client', 'ca-app-pub-5739190558910605');
        adElement.setAttribute('data-ad-slot', '4782503754');
        adElement.setAttribute('data-ad-format', 'auto');
        
        interstitialContainer.appendChild(closeButton);
        interstitialContainer.appendChild(adElement);
        document.body.appendChild(interstitialContainer);
        
        this.interstitialContainer = interstitialContainer;
        this.interstitialAd = adElement;
    }
    
    checkForInterstitialAd() {
        // Mostrar anuncio intersticial cada 20 cálculos
        if (this.calculationCount % 20 === 0) {
            this.showInterstitialAd();
        }
    }
    
    showInterstitialAd() {
        if (this.interstitialContainer) {
            console.log('Showing interstitial ad after', this.calculationCount, 'calculations');
            
            // Mostrar el contenedor
            this.interstitialContainer.style.display = 'flex';
            
            // Cargar el anuncio
            if (typeof adsbygoogle !== 'undefined' && this.interstitialAd) {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.log('Error loading interstitial ad:', e);
                }
            }
            
            // Auto-cerrar después de 15 segundos
            setTimeout(() => {
                this.closeInterstitial();
            }, 15000);
        }
    }
    
    closeInterstitial() {
        if (this.interstitialContainer) {
            this.interstitialContainer.style.display = 'none';
        }
    }
}

// Service Worker registration para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PagoMovilCalculator();
});

// Add install prompt for PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.textContent = 'Instalar App';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #1e3a8a;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
    `;
    
    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                installButton.remove();
            });
        }
    });
    
    document.body.appendChild(installButton);
    
    // Ocultar botón después de 10 segundos
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.remove();
        }
    }, 10000);
}
