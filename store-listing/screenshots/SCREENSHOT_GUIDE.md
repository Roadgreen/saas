# FoodTracks - Screenshot Guide for Store Submission

## Required Sizes

### App Store (iOS)
| Device | Resolution | Required |
|--------|-----------|----------|
| iPhone 6.7" (15 Pro Max) | 1290 x 2796 | YES |
| iPhone 6.5" (11 Pro Max) | 1242 x 2688 | YES |
| iPhone 5.5" (8 Plus) | 1242 x 2208 | YES |
| iPad Pro 12.9" (6th gen) | 2048 x 2732 | YES (if iPad supported) |
| iPad Pro 12.9" (2nd gen) | 2048 x 2732 | Optional |

### Play Store (Android)
| Type | Resolution | Required |
|------|-----------|----------|
| Phone | 1080 x 1920 (min) | YES (2-8 screenshots) |
| 7" Tablet | 1200 x 1920 | Recommended |
| 10" Tablet | 1600 x 2560 | Recommended |

## Screenshots to Capture (in order of priority)

### Screenshot 1: Dashboard / Tableau de bord
- **Screen**: Main dashboard with sales overview
- **Show**: Revenue chart, key metrics (sales, margin, orders)
- **Caption FR**: "Votre tableau de bord en un coup d'oeil"
- **Caption EN**: "Your dashboard at a glance"
- **Status bar**: Green (#16a34a) matching app theme

### Screenshot 2: Inventory Management / Gestion de stock
- **Screen**: Inventory list with product items
- **Show**: Product list with stock levels, categories, search
- **Caption FR**: "Gerez votre stock en temps reel"
- **Caption EN**: "Manage your inventory in real time"

### Screenshot 3: AI Predictions / Predictions IA
- **Screen**: Predictions page with demand forecasts
- **Show**: Prediction charts, recommended quantities, accuracy score
- **Caption FR**: "Predictions de demande par intelligence artificielle"
- **Caption EN**: "AI-powered demand predictions"

### Screenshot 4: Analytics / Analytiques
- **Screen**: Analytics page with detailed charts
- **Show**: Sales trends, location comparison, performance metrics
- **Caption FR**: "Analysez vos performances en detail"
- **Caption EN**: "Analyze your performance in detail"

### Screenshot 5: Smart Alerts / Alertes intelligentes
- **Screen**: Alerts/notifications panel
- **Show**: Low stock alerts, prediction alerts, actionable recommendations
- **Caption FR**: "Alertes intelligentes et recommandations"
- **Caption EN**: "Smart alerts and recommendations"

### Screenshot 6: Multi-Location / Multi-emplacements
- **Screen**: Location management or map view
- **Show**: Multiple locations on map, location selector, GPS detection
- **Caption FR**: "Gerez plusieurs emplacements facilement"
- **Caption EN**: "Manage multiple locations easily"

### Screenshot 7: Product Scanner / Scanner de produits
- **Screen**: Camera scanner view
- **Show**: Product scanning interface, barcode/receipt capture
- **Caption FR**: "Scannez vos produits et tickets"
- **Caption EN**: "Scan your products and receipts"

### Screenshot 8: PRO Features / Fonctionnalites PRO
- **Screen**: PRO subscription page or advanced features
- **Show**: PRO plan benefits, advanced analytics preview
- **Caption FR**: "Passez a PRO pour des fonctionnalites avancees"
- **Caption EN**: "Upgrade to PRO for advanced features"

## Screenshot Design Guidelines

### Frame Style
- Use device frames (iPhone 15 Pro / Pixel 8 mockups)
- Background: gradient from #16a34a (green-600) to #15803d (green-700)
- Caption text: White, bold, centered above/below device frame
- Font: SF Pro Display (iOS) / Google Sans (Android) or equivalent

### Localization
- Capture each screenshot with the app set to FR locale first, then EN
- Store FR screenshots in `fastlane/screenshots/fr-FR/`
- Store EN screenshots in `fastlane/screenshots/en-US/`
- Name format: `{number}_{screen_name}_{locale}.png`
  - Example: `1_dashboard_fr-FR.png`, `1_dashboard_en-US.png`

## Feature Graphic (Play Store only)
- **Size**: 1024 x 500 px
- **Design**: FoodTracks logo centered on green gradient background
- **Tagline FR**: "L'IA au service de votre food truck"
- **Tagline EN**: "AI for your food truck"

## App Preview Video (Optional, App Store)
- **Duration**: 15-30 seconds
- **Resolution**: Match screenshot device resolution
- **Content**: Quick walkthrough of dashboard > inventory > predictions > alerts
- **No voiceover required**, use captions
