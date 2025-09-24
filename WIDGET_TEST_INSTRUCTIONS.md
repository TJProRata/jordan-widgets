# Floating Widget Testing Instructions

## ✅ Fixes Applied

1. **Fixed script timing issues** - Added setTimeout and proper error handling
2. **Enhanced debugging** - Added extensive console logging throughout
3. **Fixed Vite build config** - Ensured React is properly bundled
4. **Added error handling** - Comprehensive try/catch blocks

## 🧪 How to Test the Widget

### Option 1: Using HTTP Server (RECOMMENDED)

The widget works best when served via HTTP instead of file://

I've started a Python HTTP server on port 8080. To test:

1. Open your browser
2. Navigate to: **http://localhost:8080/pages/new-green.html**
3. Open the browser console (F12 / Cmd+Option+I)
4. Look for console messages starting with `[Widget]` or `[FloatingWidget]`

### Option 2: Direct File Access

If you prefer to use file:// protocol:

1. Open: **file:///Users/tjmcgovern/jordan_widgets/pages/new-green.html**
2. Open browser console to see debug messages
3. Look for any error messages

## 🔍 What to Look For

### Success Indicators:
- ✅ You should see an "Ask AI" button at the **bottom center** of the page
- ✅ Console should show: `[Widget] ✅ Widget initialized successfully!`
- ✅ Clicking the button should expand the widget
- ✅ You can type searches and see results

### Debug Messages in Console:
```
[FloatingWidget] embed.tsx loading...
[FloatingWidget] Setting up window.FloatingWidget...
[FloatingWidget] ✅ window.FloatingWidget successfully set!
[Widget] Starting initialization sequence...
[Widget] FloatingWidget found! Initializing...
[Widget] ✅ Widget initialized successfully!
```

## 🚨 If Widget Still Doesn't Appear

Check the console for error messages:
- If you see "FloatingWidget not found" - the script isn't loading
- If you see React errors - there's a component issue
- If no messages appear - the script file isn't being loaded at all

## 💡 Alternative Solutions

If the widget still doesn't work, we can:
1. Create an inline version (no external files)
2. Use a CDN for React/ReactDOM
3. Create a simpler vanilla JavaScript version

## 📝 Current Status

- Widget is built and ready in: `floating-widget/dist/`
- Integration added to: `pages/new-green.html`
- HTTP server running on: `http://localhost:8080`
- All debugging enabled for troubleshooting