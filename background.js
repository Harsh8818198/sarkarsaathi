// Background service worker for SarkarSaathi

console.log('SarkarSaathi background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('SarkarSaathi installed!');

        // Set default language
        chrome.storage.sync.set({ language: 'en', isActive: false });

        // Open welcome page (optional)
        // chrome.tabs.create({ url: 'welcome.html' });
    }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'translate') {
        // Handle translation requests
        translateText(message.text, message.targetLanguage)
            .then(translated => sendResponse({ success: true, translated }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep channel open for async response
    }

    if (message.action === 'analyzeWithAI') {
        // Handle AI analysis requests (will integrate Tambo here)
        analyzeWithAI(message.data)
            .then(result => sendResponse({ success: true, result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

// Translation function (placeholder - will integrate Google Translate API)
async function translateText(text, targetLanguage) {
    // TODO: Integrate Google Translate API or Bhashini API
    // For now, return the original text
    console.log('Translation requested:', { text, targetLanguage });
    return text;
}

// AI analysis function (placeholder - will integrate Tambo API)
async function analyzeWithAI(data) {
    // TODO: Integrate Tambo API for AI-powered guidance
    console.log('AI analysis requested:', data);
    return { guidance: 'AI analysis coming soon!' };
}
