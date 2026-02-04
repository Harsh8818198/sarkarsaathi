# 🧪 Testing Guide for SarkarSaathi

## Quick Start Testing

### Step 1: Load Extension in Chrome

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top right)
4. Click **"Load unpacked"**
5. Navigate to and select: `C:\Users\Shank\Documents\FlowBuilder\sarkarsaathi-extension`
6. Extension should now appear in your extensions list

### Step 2: Test on Passport Seva Portal

1. Visit: https://www.passportindia.gov.in/
2. Click the **SarkarSaathi icon** in Chrome toolbar
3. Select language: **Hindi**
4. Enter query: `मुझे पासपोर्ट कैसे बनाना है?`
5. Click **"Activate SarkarSaathi"**
6. You should see:
   - Floating overlay on the right side
   - Step-by-step guidance
   - "Show me" buttons to highlight elements

### Step 3: Test Element Highlighting

1. Click any **"Show me"** button in the guidance
2. The corresponding element on the page should:
   - Get highlighted with purple outline
   - Scroll into view
   - Pulse animation
   - Auto-remove highlight after 3 seconds

### Step 4: Test Language Switching

1. Close the overlay (X button)
2. Click extension icon again
3. Change language to **Tamil**
4. Enter query: `எனக்கு பாஸ்போர்ட் எப்படி பெறுவது?`
5. Activate again
6. Guidance title should be in Tamil

## Expected Behavior

### ✅ What Should Work:
- Extension loads without errors
- Popup opens and shows UI
- Language selector has 8 options
- Overlay appears on government websites
- Page analysis detects forms
- Element highlighting works
- Close button hides overlay

### ⚠️ What's Not Implemented Yet:
- Real AI-powered guidance (using hardcoded steps)
- Translation API (showing original text)
- Tambo integration (placeholder)
- Form auto-fill
- Document validation
- Voice input

## Testing Checklist

- [ ] Extension loads in Chrome
- [ ] Popup UI displays correctly
- [ ] Can select different languages
- [ ] Overlay appears on .gov.in sites
- [ ] Guidance shows step-by-step instructions
- [ ] "Show me" buttons highlight elements
- [ ] Highlighted elements scroll into view
- [ ] Close button works
- [ ] No console errors

## Troubleshooting

### Extension doesn't load:
- Check manifest.json is valid
- Ensure all files are in the correct location
- Look for errors in `chrome://extensions/`

### Overlay doesn't appear:
- Check browser console (F12) for errors
- Verify you're on a .gov.in website
- Try refreshing the page

### Highlighting doesn't work:
- Check if element selector is correct
- Verify content.css is loaded
- Look for JavaScript errors in console

## Next Steps (Day 4)

1. Integrate Google Translate API for real translations
2. Add Tambo API for AI-generated guidance
3. Improve page analysis for different government sites
4. Add form auto-fill logic
5. Test on Income Tax and PAN websites

---

**Current Status:** Basic extension working, ready for AI integration! 🚀
