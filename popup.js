// Popup script for SarkarSaathi extension

document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language');
    const queryInput = document.getElementById('query');
    const activateButton = document.getElementById('activate');
    const statusDiv = document.getElementById('status');

    // Load saved language preference
    chrome.storage.sync.get(['language'], (result) => {
        if (result.language) {
            languageSelect.value = result.language;
        }
    });

    // Save language preference on change
    languageSelect.addEventListener('change', () => {
        chrome.storage.sync.set({ language: languageSelect.value });
    });

    // Activate SarkarSaathi
    activateButton.addEventListener('click', async () => {
        const language = languageSelect.value;
        const query = queryInput.value.trim();

        if (!query) {
            alert('Please enter your question!');
            return;
        }

        // Save user query and language
        await chrome.storage.sync.set({
            language,
            userQuery: query,
            isActive: true
        });

        // Send message to content script
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.tabs.sendMessage(tab.id, {
            action: 'activate',
            language,
            query
        }, (response) => {
            if (chrome.runtime.lastError) {
                statusDiv.textContent = '❌ Please refresh the page and try again';
                statusDiv.style.display = 'block';
                return;
            }

            statusDiv.textContent = '✅ SarkarSaathi activated!';
            statusDiv.style.display = 'block';

            // Close popup after 1 second
            setTimeout(() => {
                window.close();
            }, 1000);
        });
    });
});
