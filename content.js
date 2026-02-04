// Content script - Injected into government websites
// This is the core of SarkarSaathi that analyzes the page and provides guidance

console.log('🇮🇳 SarkarSaathi loaded!');

// State management
let isActive = false;
let currentLanguage = 'en';
let userQuery = '';
let overlayElement = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'activate') {
        isActive = true;
        currentLanguage = message.language;
        userQuery = message.query;

        activateSarkarSaathi();
        sendResponse({ success: true });
    }
    return true;
});

// Main activation function
function activateSarkarSaathi() {
    console.log('Activating SarkarSaathi...', { language: currentLanguage, query: userQuery });

    // Create overlay UI
    createOverlay();

    // Analyze the page
    const pageAnalysis = analyzePage();

    // Show guidance based on query
    showGuidance(pageAnalysis);
}

// Create floating overlay UI
function createOverlay() {
    // Remove existing overlay if any
    if (overlayElement) {
        overlayElement.remove();
    }

    overlayElement = document.createElement('div');
    overlayElement.id = 'sarkarsaathi-overlay';
    overlayElement.innerHTML = `
    <div class="ss-container">
      <div class="ss-header">
        <div class="ss-logo">🇮🇳 SarkarSaathi</div>
        <button class="ss-close" id="ss-close-btn">✕</button>
      </div>
      <div class="ss-content" id="ss-content">
        <div class="ss-loading">
          <div class="ss-spinner"></div>
          <p>Analyzing page...</p>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(overlayElement);

    // Add close button handler
    document.getElementById('ss-close-btn').addEventListener('click', () => {
        overlayElement.style.display = 'none';
        isActive = false;
    });
}

// Analyze the current page
function analyzePage() {
    const analysis = {
        url: window.location.href,
        title: document.title,
        forms: [],
        buttons: [],
        inputs: [],
        links: []
    };

    // Find all forms
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
        const formData = {
            index,
            id: form.id,
            action: form.action,
            method: form.method,
            inputs: []
        };

        // Find all inputs in this form
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            formData.inputs.push({
                type: input.type || input.tagName.toLowerCase(),
                name: input.name,
                id: input.id,
                placeholder: input.placeholder,
                required: input.required,
                label: findLabelForInput(input)
            });
        });

        analysis.forms.push(formData);
    });

    // Find all buttons
    const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
    buttons.forEach(button => {
        analysis.buttons.push({
            text: button.textContent || button.value,
            id: button.id,
            class: button.className
        });
    });

    // Find all standalone inputs (not in forms)
    const standaloneInputs = document.querySelectorAll('input:not(form input), select:not(form select), textarea:not(form textarea)');
    standaloneInputs.forEach(input => {
        analysis.inputs.push({
            type: input.type || input.tagName.toLowerCase(),
            name: input.name,
            id: input.id,
            label: findLabelForInput(input)
        });
    });

    console.log('Page analysis:', analysis);
    return analysis;
}

// Find label for an input element
function findLabelForInput(input) {
    // Try to find label by 'for' attribute
    if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) return label.textContent.trim();
    }

    // Try to find parent label
    const parentLabel = input.closest('label');
    if (parentLabel) return parentLabel.textContent.trim();

    // Try to find previous sibling label
    let prev = input.previousElementSibling;
    while (prev) {
        if (prev.tagName === 'LABEL') {
            return prev.textContent.trim();
        }
        prev = prev.previousElementSibling;
    }

    return input.placeholder || input.name || 'Unknown field';
}

// Show guidance based on analysis
async function showGuidance(analysis) {
    const contentDiv = document.getElementById('ss-content');

    // Detect website type
    const websiteType = detectWebsiteType(analysis.url);

    // Generate guidance based on query and website
    const guidance = await generateGuidance(userQuery, analysis, websiteType);

    contentDiv.innerHTML = `
    <div class="ss-guidance">
      <h3>${getTranslation('guidance_title', currentLanguage)}</h3>
      <div class="ss-steps">
        ${guidance.steps.map((step, i) => `
          <div class="ss-step">
            <div class="ss-step-number">${i + 1}</div>
            <div class="ss-step-content">
              <p>${step.text}</p>
              ${step.element ? `<button class="ss-highlight-btn" data-element="${step.element}">Show me</button>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

    // Add highlight button handlers
    document.querySelectorAll('.ss-highlight-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const elementSelector = e.target.dataset.element;
            highlightElement(elementSelector);
        });
    });
}

// Detect which government website we're on
function detectWebsiteType(url) {
    if (url.includes('passportindia.gov.in')) return 'passport';
    if (url.includes('incometax.gov.in')) return 'income_tax';
    if (url.includes('onlineservices.nsdl.com') || url.includes('pan')) return 'pan';
    if (url.includes('epfindia.gov.in')) return 'epf';
    return 'general';
}

// Generate guidance (simplified version - will integrate Tambo later)
async function generateGuidance(query, analysis, websiteType) {
    // For now, return hardcoded guidance based on website type
    // TODO: Integrate Tambo API for AI-generated guidance

    const guidanceMap = {
        passport: {
            steps: [
                { text: 'Click on "New Application" button', element: 'a[href*="newapplication"]' },
                { text: 'Select "Fresh Passport" option', element: 'input[value="fresh"]' },
                { text: 'Fill in your personal details', element: 'form' },
                { text: 'Upload required documents', element: 'input[type="file"]' }
            ]
        },
        pan: {
            steps: [
                { text: 'Click on "Apply for New PAN"', element: 'a[href*="newpan"]' },
                { text: 'Select your category (Individual/Company)', element: 'select[name="category"]' },
                { text: 'Fill the application form', element: 'form' },
                { text: 'Make payment and submit', element: 'button[type="submit"]' }
            ]
        },
        general: {
            steps: [
                { text: 'I found ' + analysis.forms.length + ' forms on this page', element: null },
                { text: 'Start by filling the first form', element: 'form' }
            ]
        }
    };

    return guidanceMap[websiteType] || guidanceMap.general;
}

// Highlight an element on the page
function highlightElement(selector) {
    // Remove previous highlights
    document.querySelectorAll('.ss-highlighted').forEach(el => {
        el.classList.remove('ss-highlighted');
    });

    // Add highlight to target element
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add('ss-highlighted');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove highlight after 3 seconds
        setTimeout(() => {
            element.classList.remove('ss-highlighted');
        }, 3000);
    }
}

// Translation helper (simplified - will add proper translation later)
function getTranslation(key, language) {
    const translations = {
        guidance_title: {
            en: 'Here\'s how to proceed:',
            hi: 'आगे बढ़ने का तरीका:',
            ta: 'இதோ செய்ய வேண்டியவை:',
            te: 'ఇలా కొనసాగించండి:',
            bn: 'এগিয়ে যাওয়ার উপায়:',
            mr: 'पुढे जाण्याचा मार्ग:',
            gu: 'આગળ વધવાની રીત:',
            kn: 'ಮುಂದುವರಿಯುವ ವಿಧಾನ:'
        }
    };

    return translations[key]?.[language] || translations[key]?.en || key;
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    console.log('SarkarSaathi initialized on:', window.location.href);

    // Check if we should auto-activate (from previous session)
    chrome.storage.sync.get(['isActive'], (result) => {
        if (result.isActive) {
            chrome.storage.sync.get(['language', 'userQuery'], (data) => {
                currentLanguage = data.language || 'en';
                userQuery = data.userQuery || '';
                if (userQuery) {
                    activateSarkarSaathi();
                }
            });
        }
    });
}
