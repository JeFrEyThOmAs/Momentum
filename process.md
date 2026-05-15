# Chrome Extension Permission Process Flow

# Goal

Create a Chrome extension that tracks:
- active tabs
- website usage time
- browsing duration per website

---

# Complete Permission Process

```text
You Build Extension
        ↓
Add Permissions in manifest.json
        ↓
Load Extension in Chrome
        ↓
Chrome Reads Permissions
        ↓
Chrome Shows Permission Popup
        ↓
User Clicks "Add Extension"
        ↓
Chrome Grants Permissions
        ↓
Extension Starts Monitoring Tabs
```

---

# Step-by-Step Internal Flow

## Step 1 — Developer Creates Extension

Example files:

```text
manifest.json
background.js
popup.html
popup.js
```

---

## Step 2 — Developer Declares Permissions

Inside:

```json
manifest.json
```

Example:

```json
{
  "permissions": [
    "tabs",
    "storage"
  ],

  "host_permissions": [
    "<all_urls>"
  ]
}
```

---

# What Happens Internally

## Chrome Reads Permissions

Chrome analyzes:

```text
tabs
storage
<all_urls>
```

and understands:

```text
This extension wants access to:
- active tabs
- website URLs
- local storage
```

---

# Step 3 — Developer Loads Extension

Go to:

```text
chrome://extensions
```

Enable:

```text
Developer Mode
```

Click:

```text
Load Unpacked
```

Select extension folder.

---

# Step 4 — Chrome Displays Permission Warning

Chrome automatically generates a popup.

Example:

```text
Website Time Tracker

Can:
• Read your browsing history
• Detect active websites
• Store local data
```

Buttons:

```text
[ Add Extension ]   [ Cancel ]
```

---

# Step 5 — User Grants Permission

When user clicks:

```text
Add Extension
```

Chrome internally enables APIs like:

```javascript
chrome.tabs
chrome.storage
```

for your extension only.

---

# Step 6 — Extension Starts Running

Background script activates.

Example:

```javascript
chrome.tabs.onActivated.addListener(...)
```

Now extension can:
- detect tab changes
- identify active websites
- calculate time spent
- save statistics

---

# Example Runtime Flow

```text
User Opens YouTube
        ↓
Extension Detects Active Tab
        ↓
Timer Starts
        ↓
User Switches to GitHub
        ↓
YouTube Timer Stops
        ↓
GitHub Timer Starts
        ↓
Data Saved Locally
```

---

# Data Storage Flow

```text
Website Name
        ↓
Time Tracked
        ↓
chrome.storage.local
        ↓
Displayed in Popup UI
```

Example:

```text
youtube.com → 45 mins
github.com → 1 hr 20 mins
instagram.com → 15 mins
```

---

# Important Security Concept

Chrome permissions are:

```text
User-Controlled
```

Meaning:
- extension cannot secretly access tabs
- user must approve first
- Chrome displays warnings clearly

---

# Local Development vs Publishing

## Local Development

```text
No review needed
No approval needed
Works immediately
```

---

## Chrome Web Store Publishing

```text
Google reviews:
- permissions
- privacy policy
- data collection
- security risks
```

---

# Simplified Architecture Diagram

```text
manifest.json
        ↓
Chrome Permission System
        ↓
Background Script
        ↓
Chrome Tabs API
        ↓
Time Tracking Logic
        ↓
Local Storage
        ↓
Popup Dashboard UI
```

---

# APIs Involved

| API | Role |
|---|---|
| chrome.tabs | Detect active tabs |
| chrome.storage | Store usage data |
| chrome.runtime | Extension lifecycle |
| chrome.action | Popup UI |

---

# Final Summary

Your extension process basically works like this:

```text
Request Permission
        ↓
User Accepts
        ↓
Chrome Gives API Access
        ↓
Extension Monitors Active Tabs
        ↓
Time Data Gets Stored
        ↓
User Views Statistics
```
