# Arm Home (ANHOME) — Premium Real Estate PropTech Platform for Armenia

Arm Home is a state-of-the-art, feature-rich real estate and property valuation platform built for Armenia (Yerevan, Gyumri, Dilijan, Tsaghkadzor, etc.). It brings premium aesthetics, transparency, and advanced technologies like AI valuation tags, interactive mapping, real-time chats, and voice/video calling to the Armenian real estate market.

The platform is designed to be fully responsive and is packaged as a hybrid mobile application (iOS & Android) using **Capacitor**, alongside a high-performance web experience.

---

## 🌟 Key Features

### 📍 Interactive Map Search
* Integrated interactive maps using **Leaflet** & **React Leaflet**.
* Supports multiple map layers including **Roadmap**, **Satellite**, and custom **Dark Mode**.
* Custom price bubble markers that scale dynamically and reflect price status.

### 🤖 AI Market Valuations
* Real-time property pricing insights.
* Visual flags showcasing deal intelligence:
  * 🟢 **Good Deal**: Below average neighborhood market rate.
  * 🔵 **Market Price**: Perfectly aligned with active market value.
  * 🔴 **Overpriced**: Higher than average regional value per square meter.

### 📞 In-App Voice & Video Calls
* Real-time audio and video call capabilities between clients and certified agents.
* Modern, collapsible calling screen mimicking native phone layouts.
* Dial tone and ringback simulation with browser AudioContext API fallback.

### 💬 Direct Chat & Group Threads
* Secure, low-latency client-agent messaging backed by **Firebase Firestore**.
* Group threads, audio message uploads, image attachments, and rich quick-reply menus.
* Real-time user presence and online status tracking.

### ⚖️ Multi-Property Comparison
* Comprehensive side-by-side comparison of up to 4 houses or apartments.
* Evaluates sqm, bedroom counts, location indices, renovation details, and investment yields.

### 📊 District Hubs & Neighborhood Data
* Dynamic analytics dashboard showing average prices per district (e.g., Kentron vs. Arabkir).
* Localized Overpass API integrations to fetch nearest Points of Interest (POIs) like schools, parks, and gyms.
* Air Quality Index (AQI) widget showing weekly forecasting trends for selected properties.

### 📸 QR Listing Scanner
* Instant scanning interface to connect offline print media, flyers, or window ads straight to digital property profiles.

---

## 🛠 Tech Stack

* **Core Framework**: [React 19](https://react.dev/), [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v3](https://tailwindcss.com/), Google Fonts (Inter), Google Material Symbols
* **State & Database**: [Firebase v12](https://firebase.google.com/) (Firestore, Auth, Storage, Cloud Messaging)
* **Mobile Runtime**: [Capacitor CLI & Core v8](https://capacitorjs.com/) (Android & iOS integration)
* **Mapping**: [Leaflet v1.9](https://leafletjs.com/), [React Leaflet v5](https://react-leaflet.js.org/)
* **Utilities**: QR Code Generators, Webcams, gyro/device motion triggers, custom CSS animations

---

## 📂 Project Directory Structure

```text
ANHOME/
├── arm_home_app/              # Main web and mobile application folder
│   ├── android/               # Capacitor Android native project
│   ├── ios/                   # Capacitor iOS native project
│   ├── src/                   # React frontend application
│   │   ├── components/        # Reusable UI components (bottom navigation, modals, call managers)
│   │   ├── context/           # AppContext state (Firebase listeners, localization, app state)
│   │   ├── data/              # Static property definitions and local mocks
│   │   ├── pages/             # App page views (Wizard, Feed, Inbox, Map, Compare, Admin)
│   │   ├── firebase.ts        # Firebase app configuration and clients
│   │   └── index.css          # Main styling sheet with Leaflet overrides and animations
│   ├── capacitor.config.ts    # Capacitor runtime configurations
│   ├── eslint.config.js       # ESLint configurations
│   ├── tailwind.config.js     # Tailwind design tokens and custom palette
│   └── vite.config.ts         # Vite build configurations
│
├── design-reference/          # HTML prototypes and visual screenshots for features
│   ├── дизайн для звоноков/    # Design files for calls
│   ├── дизайн для карточек/   # Design files for property cards
│   └── ...                    # Other design screens and assets
│
└── scripts/                   # Backend / data utility scripts
    ├── parse_excel.py         # Parses xlsx data into json
    ├── merge_properties.py    # Merges parsed excel data into src/data/properties.ts
    └── real_armenia_estate.xlsx # Source database containing initial Yerevan listings
```

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/)
* [Python 3](https://www.python.org/) (only if running database scripts)

### Installation & Run

1. Navigate to the app directory:
   ```bash
   cd arm_home_app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

To create a static production build:
```bash
npm run build
```

---

## 🔐 Security & Custom Configurations

* **Ngrok Connection**: To tunnel the local environment, update the token in `arm_home_app/ngrok.yml`:
  ```yaml
  agent:
    authtoken: YOUR_NGROK_AUTHTOKEN_HERE
  ```
* **Firebase Config**: Credentials are setup inside `arm_home_app/src/firebase.ts`. Replace them with your own Firebase Console configs if hosting a separate project.
* **Capacitor Sync**: Ensure you run `npx cap sync` after code changes if building iOS or Android packages.
