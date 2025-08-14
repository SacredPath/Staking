/**
 * Deep Link Handler for Undetected Wallets
 * Independent module that handles wallet deep linking without corrupting existing code
 */

class DeepLinkHandler {
  constructor() {
    this.supportedWallets = {
      'phantom': {
        name: 'Phantom',
        deepLink: 'https://phantom.app/ul/browse/',
        fallback: 'https://phantom.app/',
        icon: '/phantom-logo.png',
        // Correct deep link protocols for dApp browser
        mobileDeepLink: 'phantom://browse/',
        universalLink: 'https://phantom.app/ul/browse/',
        // Phantom-specific deep link formats
        dappDeepLinks: [
          'phantom://browse/',
          'phantom://dapp/',
          'phantom://open/',
          'https://phantom.app/ul/browse/',
          'https://phantom.app/ul/dapp/'
        ]
      },
      'solflare': {
        name: 'Solflare',
        deepLink: 'https://solflare.com/ul/browse/',
        fallback: 'https://solflare.com/',
        icon: '/solflare-logo.png',
        // Solflare uses custom protocol
        mobileDeepLink: 'solflare://browse/',
        universalLink: 'https://solflare.com/ul/browse/',
        // Solflare-specific deep link formats
        dappDeepLinks: [
          'solflare://browse/',
          'solflare://dapp/',
          'solflare://open/',
          'https://solflare.com/ul/browse/',
          'https://solflare.com/ul/dapp/'
        ]
      },
      'backpack': {
        name: 'Backpack',
        deepLink: 'https://backpack.app/ul/browse/',
        fallback: 'https://backpack.app/',
        icon: '/backpack-logo.png',
        // Backpack deep link protocol
        mobileDeepLink: 'backpack://browse/',
        universalLink: 'https://backpack.app/ul/browse/',
        // Backpack-specific deep link formats
        dappDeepLinks: [
          'backpack://browse/',
          'backpack://dapp/',
          'backpack://open/',
          'https://backpack.app/ul/browse/',
          'https://backpack.app/ul/dapp/'
        ]
      },
      'glow': {
        name: 'Glow',
        deepLink: 'https://glow.app/ul/browse/',
        fallback: 'https://glow.app/',
        icon: '/glow-logo.png',
        // Glow deep link protocol
        mobileDeepLink: 'glow://browse/',
        universalLink: 'https://glow.app/ul/browse/',
        // Glow-specific deep link formats
        dappDeepLinks: [
          'glow://browse/',
          'glow://dapp/',
          'glow://open/',
          'https://glow.app/ul/browse/',
          'https://glow.app/ul/dapp/'
        ]
      },
      'exodus': {
        name: 'Exodus',
        deepLink: 'https://exodus.com/ul/browse/',
        fallback: 'https://exodus.com/',
        icon: '/exodus-logo.png',
        // Exodus deep link protocol
        mobileDeepLink: 'exodus://browse/',
        universalLink: 'https://exodus.com/ul/browse/',
        // Exodus-specific deep link formats
        dappDeepLinks: [
          'exodus://browse/',
          'exodus://dapp/',
          'exodus://open/',
          'https://exodus.com/ul/browse/',
          'https://exodus.com/ul/dapp/'
        ]
      }
    };
    
    this.currentUrl = window.location.href;
    this.isMobile = this.detectMobile();
    this.init();
  }

  /**
   * Detect if user is on mobile device
   */
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Initialize deep link handler
   */
  init() {
    console.log('[DEEP_LINK] Handler initialized for mobile:', this.isMobile);
    
    // Add deep link button to wallet modal if it exists
    this.addDeepLinkButton();
    
    // Listen for wallet detection failures
    this.listenForWalletFailures();
  }

  /**
   * Add deep link button to existing wallet modal
   */
  addDeepLinkButton() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const walletModal = document.getElementById('walletModal');
      if (walletModal) {
        // Only inject deep link section if there are wallets detected but none are available
        this.checkAndInjectDeepLink(walletModal);
      }
    }, 1000);
  }

  /**
   * Check if deep link section should be injected
   */
  checkAndInjectDeepLink(walletModal) {
    // Check if deep link section already exists
    if (document.getElementById('deepLinkButton') || document.querySelector('.deep-link-section')) {
      return;
    }

    // Check if there are any wallets detected
    const walletList = walletModal.querySelector('#walletList');
    if (!walletList) return;

    // Look for wallet items to determine if wallets are detected
    const walletItems = walletList.querySelectorAll('.wallet-item');
    const hasWallets = walletItems.length > 0;

    // Only inject deep link section if there are wallets detected but none are available
    if (hasWallets) {
      // Check if any wallets are available (have 'available' status)
      const availableWallets = walletList.querySelectorAll('.wallet-status.available');
      if (availableWallets.length === 0) {
        // No wallets are available, inject deep link section
        this.injectDeepLinkButton(walletModal);
      }
    }
    // If no wallets detected at all, don't inject - the main modal will handle it
  }

  /**
   * Inject deep link button into wallet modal
   */
  injectDeepLinkButton(walletModal) {
    // Check if deep link button already exists
    if (document.getElementById('deepLinkButton') || document.querySelector('.deep-link-section')) {
      return;
    }

    const deepLinkSection = document.createElement('div');
    deepLinkSection.className = 'deep-link-section';
    deepLinkSection.innerHTML = `
      <div class="deep-link-header">
        <h4>🌐 Mobile Wallet Deep Link</h4>
        <p>If your wallet isn't detected, use deep linking:</p>
      </div>
      <div class="deep-link-buttons">
        ${this.generateDeepLinkButtons()}
      </div>
    `;

    // Insert after wallet list
    const walletList = walletModal.querySelector('#walletList');
    if (walletList && walletList.parentNode) {
      walletList.parentNode.insertBefore(deepLinkSection, walletList.nextSibling);
    }

    // Add event listeners
    this.addDeepLinkEventListeners();
  }

  /**
   * Generate deep link buttons for all supported wallets
   */
  generateDeepLinkButtons() {
    return Object.entries(this.supportedWallets)
      .map(([key, wallet]) => `
        <button 
          class="deep-link-btn" 
          data-wallet="${key}"
          onclick="window.deepLinkHandler.openDeepLink('${key}')"
        >
          <img src="${wallet.icon}" alt="${wallet.name}" class="wallet-icon">
          <span>Open ${wallet.name}</span>
        </button>
      `).join('');
  }

  /**
   * Add event listeners for deep link buttons
   */
  addDeepLinkEventListeners() {
    const buttons = document.querySelectorAll('.deep-link-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const walletKey = button.dataset.wallet;
        this.openDeepLink(walletKey);
      });
    });
  }

  /**
   * Open deep link for specific wallet
   */
  openDeepLink(walletKey) {
    const wallet = this.supportedWallets[walletKey];
    if (!wallet) {
      console.error('[DEEP_LINK] Unknown wallet:', walletKey);
      return;
    }

    console.log(`[DEEP_LINK] Opening deep link for ${wallet.name}`);

    if (this.isMobile) {
      // Mobile: Try deep link first, fallback to app store
      this.attemptEnhancedDeepLink(wallet, walletKey);
    } else {
      // Desktop: Show instructions
      this.showDesktopInstructions(wallet);
    }
  }

  /**
   * Attempt deep link on mobile with proper dApp browser protocols
   */
  attemptDeepLink(wallet, walletKey) {
    // Use the correct deep link protocol for dApp browser
    const deepLinkUrl = wallet.mobileDeepLink + encodeURIComponent(this.currentUrl);
    
    console.log(`[DEEP_LINK] Attempting deep link: ${deepLinkUrl}`);
    
    // Method 1: Try direct window.location.href (most reliable for custom protocols)
    try {
      window.location.href = deepLinkUrl;
    } catch (error) {
      console.log('[DEEP_LINK] Direct deep link failed, trying iframe method');
      this.attemptIframeDeepLink(deepLinkUrl, wallet, walletKey);
    }

    // Set timeout for fallback
    const fallbackTimeout = setTimeout(() => {
      this.showFallbackOptions(wallet, walletKey);
    }, 3000);

    // Listen for app focus/blur to detect if deep link worked
    let hasAppFocused = false;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hasAppFocused = true;
        clearTimeout(fallbackTimeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('blur', handleBlur);
        document.removeEventListener('focus', handleFocus);
      }
    };

    const handleBlur = () => {
      hasAppFocused = true;
      clearTimeout(fallbackTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('blur', handleBlur);
      document.removeEventListener('focus', handleFocus);
    };

    const handleFocus = () => {
      if (hasAppFocused) {
        // App was opened and returned, deep link likely worked
        console.log(`[DEEP_LINK] ${wallet.name} deep link appears to have worked`);
        this.showSuccessMessage(wallet.name);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('blur', handleBlur);
    document.addEventListener('focus', handleFocus);
  }

  /**
   * Fallback method using iframe for deep linking
   */
  attemptIframeDeepLink(deepLinkUrl, wallet, walletKey) {
    // Create hidden iframe for deep linking
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLinkUrl;
    document.body.appendChild(iframe);

    // Clean up iframe after attempt
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }

  /**
   * Enhanced deep linking with multiple methods
   */
  attemptEnhancedDeepLink(wallet, walletKey) {
    const currentUrl = encodeURIComponent(this.currentUrl);
    
    // Use wallet-specific deep link formats
    const deepLinkAttempts = wallet.dappDeepLinks.map(baseUrl => `${baseUrl}${currentUrl}`);
    
    console.log(`[DEEP_LINK] Trying ${deepLinkAttempts.length} deep link formats for ${wallet.name}`);
    
    // Try each deep link format
    deepLinkAttempts.forEach((deepLink, index) => {
      setTimeout(() => {
        this.trySingleDeepLink(deepLink, wallet, walletKey, index === deepLinkAttempts.length - 1);
      }, index * 300); // Stagger attempts with shorter delays
    });
  }

  /**
   * Try a single deep link format
   */
  trySingleDeepLink(deepLink, wallet, walletKey, isLastAttempt) {
    console.log(`[DEEP_LINK] Attempting: ${deepLink}`);
    
    try {
      // Method 1: Direct location change
      window.location.href = deepLink;
    } catch (error) {
      console.log(`[DEEP_LINK] Direct method failed for: ${deepLink}`);
      
      // Method 2: Create a temporary link and click it
      const tempLink = document.createElement('a');
      tempLink.href = deepLink;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(tempLink)) {
          document.body.removeChild(tempLink);
        }
      }, 1000);
    }

    // If this is the last attempt, show fallback after delay
    if (isLastAttempt) {
      setTimeout(() => {
        this.showFallbackOptions(wallet, walletKey);
      }, 4000);
    }
  }

  /**
   * Show fallback options if deep link fails
   */
  showFallbackOptions(wallet, walletKey) {
    const fallbackModal = document.createElement('div');
    fallbackModal.className = 'fallback-modal';
    fallbackModal.innerHTML = `
      <div class="fallback-content">
        <h3>📱 ${wallet.name} Not Found</h3>
        <p>We couldn't open ${wallet.name} automatically. Please choose an option:</p>
        
        <div class="fallback-buttons">
          <button onclick="window.deepLinkHandler.openAppStore('${walletKey}')" class="fallback-btn primary">
            📱 Install ${wallet.name}
          </button>
          <button onclick="window.deepLinkHandler.openFallbackUrl('${walletKey}')" class="fallback-btn secondary">
            🌐 Open ${wallet.name} Website
          </button>
          <button onclick="window.deepLinkHandler.closeFallbackModal()" class="fallback-btn">
            ❌ Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(fallbackModal);
    
    // Add styles if not already present
    this.addFallbackStyles();
  }

  /**
   * Open app store for wallet
   */
  openAppStore(walletKey) {
    const wallet = this.supportedWallets[walletKey];
    if (!wallet) return;

    let appStoreUrl = '';
    
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // iOS App Store
      switch (walletKey) {
        case 'phantom':
          appStoreUrl = 'https://apps.apple.com/app/phantom-crypto-wallet/id1598432977';
          break;
        case 'solflare':
          appStoreUrl = 'https://apps.apple.com/app/solflare-wallet/id1580902717';
          break;
        case 'backpack':
          appStoreUrl = 'https://apps.apple.com/app/backpack/id6443944476';
          break;
        case 'glow':
          appStoreUrl = 'https://apps.apple.com/app/glow-wallet/id1634110026';
          break;
        case 'exodus':
          appStoreUrl = 'https://apps.apple.com/app/exodus-crypto-wallet/id1414384820';
          break;
      }
    } else if (/Android/i.test(navigator.userAgent)) {
      // Google Play Store
      switch (walletKey) {
        case 'phantom':
          appStoreUrl = 'https://play.google.com/store/apps/details?id=app.phantom';
          break;
        case 'solflare':
          appStoreUrl = 'https://play.google.com/store/apps/details?id=com.solflare.mobile';
          break;
        case 'backpack':
          appStoreUrl = 'https://play.google.com/store/apps/details?id=com.backpack.app';
          break;
        case 'glow':
          appStoreUrl = 'https://play.google.com/store/apps/details?id=com.glow.wallet';
          break;
        case 'exodus':
          appStoreUrl = 'https://play.google.com/store/apps/details?id=exodusmovement.exodus';
          break;
      }
    }

    if (appStoreUrl) {
      window.open(appStoreUrl, '_blank');
    }
    
    this.closeFallbackModal();
  }

  /**
   * Open fallback URL for wallet
   */
  openFallbackUrl(walletKey) {
    const wallet = this.supportedWallets[walletKey];
    if (wallet && wallet.fallback) {
      window.open(wallet.fallback, '_blank');
    }
    this.closeFallbackModal();
  }

  /**
   * Close fallback modal
   */
  closeFallbackModal() {
    const modal = document.querySelector('.fallback-modal');
    if (modal) {
      document.body.removeChild(modal);
    }
  }

  /**
   * Show success message
   */
  showSuccessMessage(walletName) {
    if (window.showStatus) {
      window.showStatus(`✅ ${walletName} deep link opened successfully!`, 'success');
    } else {
      // Fallback notification
      this.showNotification(`✅ ${walletName} deep link opened successfully!`, 'success');
    }
  }

  /**
   * Show desktop instructions
   */
  showDesktopInstructions(wallet) {
    const instructionsModal = document.createElement('div');
    instructionsModal.className = 'instructions-modal';
    instructionsModal.innerHTML = `
      <div class="instructions-content">
        <h3>💻 ${wallet.name} on Desktop</h3>
        <p>To use ${wallet.name} on desktop:</p>
        <ol>
          <li>Install the ${wallet.name} browser extension</li>
          <li>Refresh this page</li>
          <li>Click "Connect Wallet" again</li>
        </ol>
        <button onclick="window.deepLinkHandler.closeInstructionsModal()" class="instructions-btn">
          Got it!
        </button>
      </div>
    `;

    document.body.appendChild(instructionsModal);
    this.addInstructionsStyles();
  }

  /**
   * Close instructions modal
   */
  closeInstructionsModal() {
    const modal = document.querySelector('.instructions-modal');
    if (modal) {
      document.body.removeChild(modal);
    }
  }

  /**
   * Show notification (fallback)
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  }

  /**
   * Add fallback modal styles
   */
  addFallbackStyles() {
    if (document.getElementById('fallback-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'fallback-styles';
    style.textContent = `
      .fallback-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      
      .fallback-content {
        background: #1a1a2e;
        border: 2px solid #ffd23f;
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        text-align: center;
        color: white;
      }
      
      .fallback-buttons {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
      }
      
      .fallback-btn {
        padding: 15px 20px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .fallback-btn.primary {
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        color: white;
      }
      
      .fallback-btn.secondary {
        background: #2a2a3e;
        color: white;
        border: 1px solid #ffd23f;
      }
      
      .fallback-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Add instructions modal styles
   */
  addInstructionsStyles() {
    if (document.getElementById('instructions-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'instructions-styles';
    style.textContent = `
      .instructions-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      
      .instructions-content {
        background: #1a1a2e;
        border: 2px solid #ffd23f;
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        text-align: center;
        color: white;
      }
      
      .instructions-content ol {
        text-align: left;
        margin: 20px 0;
        padding-left: 20px;
      }
      
      .instructions-content li {
        margin: 10px 0;
        color: #e0e0e0;
      }
      
      .instructions-btn {
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .instructions-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Listen for wallet detection failures
   */
  listenForWalletFailures() {
    // Override console.error to catch wallet detection issues
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Check for wallet detection failures
      if (message.includes('wallet') && message.includes('detect') || 
          message.includes('injection') && message.includes('failed') ||
          message.includes('provider') && message.includes('not found')) {
        
        console.log('[DEEP_LINK] Wallet detection failure detected, deep linking available');
        this.showDeepLinkPrompt();
      }
      
      // Call original console.error
      originalError.apply(console, args);
    };
  }

  /**
   * Show deep link prompt when wallet detection fails
   */
  showDeepLinkPrompt() {
    // Only show once per session
    if (sessionStorage.getItem('deepLinkPromptShown')) return;
    
    setTimeout(() => {
      this.showNotification('🌐 Wallet not detected? Try deep linking for mobile wallets!', 'info');
      sessionStorage.setItem('deepLinkPromptShown', 'true');
    }, 2000);
  }
}

// Initialize deep link handler when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.deepLinkHandler = new DeepLinkHandler();
  });
} else {
  window.deepLinkHandler = new DeepLinkHandler();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeepLinkHandler;
}
