# FoodTracks - Store Listing Assets Guide

## Overview
This document describes all assets needed for App Store and Play Store submission.

## App Identity

| Field | Value |
|-------|-------|
| App Name | FoodTracks |
| Bundle ID (iOS) | io.foodtracks.app |
| Package Name (Android) | io.foodtracks.app |
| Primary Language | French (fr-FR) |
| Secondary Language | English (en-US) |
| Primary Category | Business |
| Secondary Category | Food & Drink |
| Pricing | Free with in-app subscription |
| Content Rating | 4+ (iOS) / Everyone (Android) |
| Version | 1.0 |

---

## App Icons

### Current Status: CONFIGURED
App icons are already generated and placed in:
- **iOS**: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
  - Sizes: 20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 512@2x, 1024
- **Android**: `android/app/src/main/res/mipmap-*/`
  - Densities: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi, anydpi-v26

### Requirements
- No transparency (iOS)
- No rounded corners in source (iOS auto-applies)
- 1024x1024 master icon recommended

---

## Splash Screen

### Current Status: CONFIGURED
- **iOS**: `ios/App/App/Assets.xcassets/Splash.imageset/` (2732x2732)
- **Android**: `android/app/src/main/res/drawable-*/` (multiple densities)
- **Color**: #16a34a (green-600)
- **Capacitor config**: `launchShowDuration: 2000`, `backgroundColor: #16a34a`

---

## Store Metadata Files

### App Store Connect (via Fastlane)
Location: `fastlane/metadata/`

```
fastlane/metadata/
  fr-FR/
    name.txt              - App name
    subtitle.txt          - App subtitle (30 chars max)
    description.txt       - Full description
    keywords.txt          - Search keywords (100 chars max, comma-separated)
    release_notes.txt     - What's New
    promotional_text.txt  - Promotional text (170 chars max)
    privacy_url.txt       - Privacy policy URL
    support_url.txt       - Support URL
    marketing_url.txt     - Marketing URL
  en-US/
    (same structure)
  review_information/
    review_notes.txt      - Notes for App Review team
```

### Google Play Console
Location: `store-listing/play-store/`

```
store-listing/play-store/
  fr/
    short_description.txt - Short description (80 chars max)
    full_description.txt  - Full description (4000 chars max)
  en/
    (same structure)
```

---

## Screenshots
See `store-listing/screenshots/SCREENSHOT_GUIDE.md` for detailed specifications.

### Summary
- 8 screenshots per language per device size
- Minimum: iPhone 6.7" + 6.5" + 5.5" (iOS), Phone (Android)
- Capture in both FR and EN
- Use device frames with green gradient background and captions

---

## Privacy & Legal Pages

### Current Status: CREATED
- Privacy Policy: `app/[locale]/privacy/page.tsx` -> https://foodtracks.io/privacy
- Terms of Use: `app/[locale]/terms/page.tsx` -> https://foodtracks.io/terms
- Both pages are bilingual (FR/EN)
- GDPR compliant

---

## App Store Specific Requirements

### App Review Information
- Located in `fastlane/metadata/review_information/review_notes.txt`
- Includes testing instructions and login flow
- No demo account needed (free signup)

### Age Rating
- Configured in `fastlane/rating_config.json`
- Rating: 4+ (no objectionable content)
- UNRESTRICTED_WEB_ACCESS: 1 (app loads web content)

### In-App Purchases
- Type: Auto-renewable subscription
- Product: PRO Plan
- Must be configured in App Store Connect separately

### Export Compliance
- No encryption beyond HTTPS
- Exempt from export compliance documentation

---

## Google Play Specific Requirements

### Content Rating Questionnaire
- Category: Utility / Business
- Violence: None
- Sexual Content: None
- Language: None
- Controlled Substance: None
- Target Age: 16+

### Data Safety Section
Must declare in Google Play Console:
- **Data collected**: Email, name, location, photos (camera), purchase history
- **Data shared**: Payment data with Stripe/SumUp
- **Security**: Data encrypted in transit, data can be deleted by user request
- **Purpose**: App functionality, analytics, account management

### Feature Graphic
- 1024 x 500 px
- Place in `store-listing/play-store/fr/featureGraphic.png`
- Place in `store-listing/play-store/en/featureGraphic.png`

---

## Pre-Submission Checklist

### iOS
- [ ] App icons in all required sizes
- [ ] Splash screen configured
- [ ] Info.plist has all required usage descriptions (Camera, Location)
- [ ] Screenshots for all required device sizes (6.7", 6.5", 5.5")
- [ ] App Store metadata in FR and EN
- [ ] Privacy Policy URL accessible
- [ ] Terms of Use URL accessible
- [ ] In-app purchase configured in App Store Connect
- [ ] Age rating questionnaire completed
- [ ] App Review notes provided
- [ ] Export compliance answered

### Android
- [ ] App icons in all required densities
- [ ] Splash screen configured
- [ ] Screenshots for phone (min 2)
- [ ] Feature graphic (1024x500)
- [ ] Play Store listing in FR and EN
- [ ] Privacy Policy URL accessible
- [ ] Content rating questionnaire completed
- [ ] Data safety section completed
- [ ] Target API level meets Play Store requirements
- [ ] App signing configured

---

## Fastlane Commands

```bash
# Upload iOS metadata to App Store Connect
bundle exec fastlane ios upload_metadata

# Upload iOS screenshots
bundle exec fastlane ios upload_screenshots

# Submit for review
bundle exec fastlane ios submit_review

# Upload Android metadata to Play Store
bundle exec fastlane android upload_metadata

# Upload Android screenshots
bundle exec fastlane android upload_screenshots
```

---

## File Structure Summary

```
foodtracks/
  fastlane/
    Appfile                          # App identifiers
    Fastfile                         # Lane definitions
    rating_config.json               # iOS age rating
    metadata/
      fr-FR/                         # French App Store metadata
      en-US/                         # English App Store metadata
      review_information/            # App Review notes
    screenshots/
      fr-FR/                         # French screenshots
      en-US/                         # English screenshots
  store-listing/
    STORE_ASSETS_GUIDE.md            # This file
    screenshots/
      SCREENSHOT_GUIDE.md            # Screenshot specs
    play-store/
      fr/                            # French Play Store metadata
      en/                            # English Play Store metadata
    app-store/
      fr/                            # French App Store supplementary
      en/                            # English App Store supplementary
  app/[locale]/
    privacy/page.tsx                 # Privacy Policy page
    terms/page.tsx                   # Terms of Use page
```
