# Multi-Language Feature Implementation Guide

## Overview
Gold Guardian now supports 5 regional languages with instant translation without page reload.

**Supported Languages:**
- 🌐 English (en)
- 🇮🇳 हिंदी (hi) - Devanagari
- 🌴 தமிழ் (ta) - Tamil
- 🏛️ मराठी (mr) - Devanagari  
- 🌾 ਪੰਜਾਬੀ (pa) - Gurmukhi

---

## Architecture

### 1. Translation File Structure
```
src/locales/
├── en/
│   └── common.json          # English translations
├── hi/
│   └── common.json          # Hindi (Devanagari)
├── ta/
│   └── common.json          # Tamil script
├── mr/
│   └── common.json          # Marathi (Devanagari)
└── pa/
    └── common.json          # Punjabi (Gurmukhi)
```

### 2. Configuration Files
- **`src/config/i18n.js`** - i18next configuration
- **`src/hooks/useI18n.js`** - Custom React hooks and utilities
- **`src/components/LanguageSelector.jsx`** - Language switcher UI component
- **`src/styles/languageSelector.css`** - Styling for language buttons

---

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install i18next react-i18next
```

### Step 2: Initialize i18n in main.jsx
Add this to your `src/main.jsx`:

```jsx
import i18n from './config/i18n'

// Initialize i18n before rendering
i18n.init()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>,
)
```

### Step 3: Add Fonts to HTML Head
Add to `index.html` for proper regional script support:

```html
<head>
  <!-- Google Fonts for Regional Scripts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari&family=Noto+Sans+Tamil&family=Noto+Sans+Gurmukhi&display=swap" rel="stylesheet">
  
  <style>
    /* Set default font for regional scripts */
    :root {
      --font-regional: 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Gurmukhi', sans-serif;
    }
    
    html[lang="hi"],
    html[lang="mr"],
    html[lang="ta"],
    html[lang="pa"] {
      font-family: var(--font-regional);
    }
  </style>
</head>
```

---

## Implementation Examples

### Example 1: Using Translations in Components

**Before (without i18n):**
```jsx
export function Home() {
  return (
    <div>
      <h1>Gold Guardian</h1>
      <p>Protect Your Gold Investment</p>
    </div>
  )
}
```

**After (with i18n):**
```jsx
import { useTranslation } from 'react-i18next'

export function Home() {
  const { t } = useTranslation('common')
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  )
}
```

### Example 2: Using Custom Hook
```jsx
import { useAppTranslations } from '../hooks/useI18n'

export function CalculatorPage() {
  const { t, language } = useAppTranslations()
  
  return (
    <div>
      <h1>{t('calculator.title')}</h1>
      <input placeholder={t('calculator.weight')} />
      <p>Current Language: {language}</p>
    </div>
  )
}
```

### Example 3: Using Language Selector Component
```jsx
import LanguageSelector from '../components/LanguageSelector'
import Navbar from './Navbar'

export function Layout() {
  return (
    <>
      <Navbar />
      <LanguageSelector />
      {/* Rest of layout */}
    </>
  )
}
```

### Example 4: Using Formatting Utilities
```jsx
import { formatCurrencyByLanguage, formatDateByLanguage } from '../hooks/useI18n'

export function ResultCard({ amount, date }) {
  const language = localStorage.getItem('language') || 'en'
  
  return (
    <div>
      <p>Fair Price: {formatCurrencyByLanguage(amount, language)}</p>
      <p>Date: {formatDateByLanguage(date, language)}</p>
    </div>
  )
}
```

---

## Translation Key Structure

Translation keys follow a hierarchical structure:

```json
{
  "navbar": {
    "home": "Home",
    "calculator": "Calculator"
  },
  "hero": {
    "title": "Gold Guardian",
    "subtitle": "Protect Your Gold Investment",
    "description": "..."
  },
  "calculator": {
    "title": "Gold Price Calculator",
    "weight": "Gold Weight (grams)",
    "result": "Price Calculation Result"
  },
  "errors": {
    "emptyField": "Please fill in all fields",
    "invalidEmail": "Invalid email address"
  }
}
```

**Usage:**
```jsx
t('navbar.home')           // "Home"
t('calculator.weight')     // "Gold Weight (grams)"
t('errors.emptyField')     // "Please fill in all fields"
```

---

## Pages to Update

### Priority 1 (Core Pages):
- [ ] `Navbar.jsx` - Navigation items
- [ ] `Home.jsx` - Hero section, features, CTA
- [ ] `Calculator.jsx` - Form labels, button text, results
- [ ] `VerifyHUID.jsx` - Form fields, results, messaging

### Priority 2 (Auth Pages):
- [ ] `Login.jsx` - Form labels, buttons, validation errors
- [ ] `Signup.jsx` - Form labels, buttons, validation errors
- [ ] `Profile.jsx` - Profile information display

### Priority 3 (Additional Pages):
- [ ] `Complaint.jsx` - Form fields, buttons
- [ ] `Learn.jsx` - Educational content

---

## Update Page Example

### Before:
```jsx
export function Navbar() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/calculator">Calculator</a>
      <a href="/verify">Verify HUID</a>
    </nav>
  )
}
```

### After:
```jsx
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const { t } = useTranslation('common')
  
  return (
    <nav>
      <a href="/">{t('navbar.home')}</a>
      <a href="/calculator">{t('navbar.calculator')}</a>
      <a href="/verify">{t('navbar.verifyHuid')}</a>
    </nav>
  )
}
```

---

## Font Compatibility Considerations

### Regional Script Fonts
| Language | Script | Font Family | Supports |
|----------|--------|-------------|----------|
| Hindi | Devanagari | Noto Sans Devanagari | ा ि ी ु ू ृ ॄ |
| Tamil | Tamil | Noto Sans Tamil | ா ி ீ ு ூ ் |
| Punjabi | Gurmukhi | Noto Sans Gurmukhi | ਾ ਿ ੀ ੁ ੂ ੰ |
| Marathi | Devanagari | Noto Sans Devanagari | Same as Hindi |

### Add to CSS:
```css
/* Ensure proper rendering across languages */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Gurmukhi',
    sans-serif;
}

/* Specific line-height for regional scripts */
html[lang="hi"],
html[lang="mr"],
html[lang="ta"],
html[lang="pa"] {
  line-height: 1.6;
  letter-spacing: 0.3px;
}
```

---

## Performance Optimization

### 1. Lazy Load Translations
```jsx
// Only load the default language initially
// Others are loaded on-demand when selected
```

### 2. Cache Language Selection
```jsx
// Already implemented via localStorage
// Selected language persists across sessions
```

### 3. Minimize Bundle Size
- Translations are JSON files, not compiled code
- Only active language is rendered
- Typical bundle increase: ~50-100KB

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | All regional scripts supported |
| Firefox | ✅ Full | All regional scripts supported |
| Safari | ✅ Full | May need system fonts installed |
| Edge | ✅ Full | All regional scripts supported |
| Mobile (iOS) | ✅ Full | Uses system fonts |
| Mobile (Android) | ✅ Full | Uses system fonts |

---

## Testing Translations

### Manual Testing Checklist:
- [ ] Switch between all 5 languages
- [ ] Verify UI updates instantly without reload
- [ ] Check all text renders correctly (no mojibake)
- [ ] Test on mobile devices
- [ ] Verify localStorage persists language
- [ ] Test with longer text (check text overflow)
- [ ] Verify RTL support (future expansion)

### Automated Testing:
```javascript
// Example Jest test
import { render, screen } from '@testing-library/react'
import Home from './pages/Home'

test('renders home in Hindi', () => {
  localStorage.setItem('language', 'hi')
  render(<Home />)
  // Assertions
})
```

---

## Future Enhancements

### Planned Features:
- [ ] Save language preference to user profile (backend)
- [ ] Add Telugu, Kannada, Malayalam
- [ ] RTL support for Arabic/Urdu
- [ ] Automatic language detection by browser/IP
- [ ] Regional number formats (e.g., Indian numerals)
- [ ] Namespace-based translations for better organization
- [ ] Translation management dashboard for admins

---

## Troubleshooting

### Issue: Text appears as boxes (mojibake)
**Solution:** Ensure Google Fonts are loaded and font-family is set in CSS

### Issue: Language doesn't change
**Solution:** Check browser console for i18n errors, verify JSON syntax

### Issue: Performance is slow
**Solution:** i18next is optimized; check if other performance issues exist

### Issue: Translations missing for a key
**Solution:** Add missing key to all translation files with same path

---

## File Inventory

```
src/
├── config/
│   └── i18n.js                          (NEW) i18n configuration
├── locales/
│   ├── en/
│   │   └── common.json                  (NEW) English translations
│   ├── hi/
│   │   └── common.json                  (NEW) Hindi translations
│   ├── ta/
│   │   └── common.json                  (NEW) Tamil translations
│   ├── mr/
│   │   └── common.json                  (NEW) Marathi translations
│   └── pa/
│       └── common.json                  (NEW) Punjabi translations
├── components/
│   └── LanguageSelector.jsx             (NEW) Language switcher
├── hooks/
│   └── useI18n.js                       (NEW) i18n utilities
├── styles/
│   └── languageSelector.css             (NEW) Selector styling
├── main.jsx                             (MODIFY) Add i18n provider
└── App.jsx                              (MODIFY) Add LanguageSelector to layout
```

---

## Support & Resources

- **i18n Documentation:** https://www.i18next.com/
- **React-i18next:** https://react.i18next.com/
- **Google Fonts Regional Scripts:** https://fonts.google.com/?subset=devanagari,tamil,gurmukhi
- **Unicode Standards:** https://unicode.org/reports/tr37/

---

## Contact & Questions

For questions about implementation, refer to the code comments in each file for detailed explanations.
