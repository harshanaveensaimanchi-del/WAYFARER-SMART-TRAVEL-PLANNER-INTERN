# Wayfarer — Smart Travel Planner

A beautiful, spacious travel planning frontend built with React, TypeScript, and Vite. Organize trips, explore the 7 Wonders of the World and sacred temples of India, build day-by-day itineraries, and track expenses with **instant real-time multi-currency conversion** (Indian Rupee ₹, US Dollar $, British Pound £, Euro €, etc.).

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)

---

## ✨ Features

- **Real-Time Multi-Currency Conversion**:
  - Live currency selector directly in both Topbar and Sidebar.
  - Choose from **Indian Rupee (₹ INR)**, **US Dollar ($ USD)**, **British Pound (£ GBP)**, **Euro (€ EUR)**, **Japanese Yen (¥ JPY)**, **UAE Dirham (AED)**, **Australian Dollar (A$ AUD)**, **Canadian Dollar (C$ CAD)**, **Singapore Dollar (S$ SGD)**, **Thai Baht (฿ THB)**, and **Swiss Franc (CHF)**.
  - Automatically fetches live exchange rates from `https://open.er-api.com/v6/latest/USD` with reliable fallback market rates.
  - Instant real-time conversion across the entire site: Dashboard totals, Trip budget cards, Itinerary stats, and Expense breakdown tables update immediately when changing currency!
  - One-click refresh button with spinning live animation.

- **Worldwide Famous Places, 7 Wonders & Sacred Temples of India**:
  - **7 Wonders of the World**: Taj Mahal, Great Wall of China, Petra, Colosseum, Machu Picchu, Christ the Redeemer, Chichén Itzá, and Great Pyramids of Giza.
  - **Sacred Temples of India**: Kashi Vishwanath & Varanasi Ghats, Sri Harmandir Sahib (Golden Temple Amritsar), Tirupati Balaji (Tirumala), Meenakshi Amman Temple (Madurai), Kedarnath Temple, Konark Sun Temple, Brihadeeswarar Temple (Thanjavur), Swaminarayan Akshardham (Delhi), Somnath Temple (Gujarat), and Virupaksha Temple (Hampi).
  - **Global Heritage & Icons**: Eiffel Tower (France), Mount Fuji (Japan), Santorini Caldera (Greece), Burj Khalifa (Dubai, UAE), and more.
  - Filter by Category (7 Wonders, Indian Temples, World Heritage, Nature) and by Country (India, Italy, China, Egypt, France, Japan, etc.).
  - **One-Click "Plan trip"**: Pre-fills trip destination, suggested budget (converted to your chosen currency), cover photo, and duration.
  - **One-Click "Add to Itinerary"**: Automatically adds top temple / wonder highlights into your active trip's schedule.

- **Landing Page**:
  - Editorial hero imagery with Taj Mahal, product introduction, interactive showcase of famous places, and calls to action.

- **Dashboard**:
  - Next-trip hero card, 4 multi-currency stat cards, upcoming trips list, quick activity checklist, and inspiring wonders gallery.

- **Trips Management**:
  - Card grid with search, status filters (All / Upcoming / Active / Completed / Favorites), sorting by date/name/budget, full CRUD, and budget utilization bars.

- **Trip Details & Itinerary**:
  - Daily activity plans with times, categories, notes, completion toggles, move controls (reordering), and an interactive calendar view.

- **Expense Tracker & Budget Utilization**:
  - Real-time running total, budget remaining, utilization meter, category breakdown with visual colored bars, and sortable expense table.

- **Light / Dark Mode**:
  - Persistent theme toggle between soft ivory and charcoal styles.

---

## 🗂 Folder Structure

```
├── index.html                  # Entry HTML (loads /src/main.tsx)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx                # React root mount
    ├── App.tsx                 # App shell: router, topbar with currency, CRUD logic
    ├── types.ts                # Shared TypeScript interfaces & types
    ├── components/
    │   └── FormModal.tsx       # Modal form for trips, activities, expenses
    ├── data/
    │   ├── currencies.ts       # Supported currencies, symbols, locales & baseline rates
    │   ├── famousPlaces.ts     # 7 Wonders, Indian Temples, and World Heritage data
    │   └── seed.ts             # Starter trips, activities, expenses, photos
    ├── hooks/
    │   ├── useCurrency.ts      # Live exchange rate fetcher & real-time currency converter
    │   ├── useLocalStorage.ts  # Generic localStorage hook
    │   └── useToast.ts         # Auto-dismissing toast notification hook
    ├── pages/
    │   ├── LandingPage.tsx     # Marketing page with Wonders & Temples showcase
    │   ├── DashboardPage.tsx   # Overview dashboard with real-time currency stats
    │   ├── ExplorePage.tsx     # Dedicated 7 Wonders & Indian Temples explorer
    │   ├── TripsPage.tsx       # Trip list with filters
    │   ├── ItineraryPage.tsx   # Trip detail + activities + calendar view
    │   └── ExpensesPage.tsx    # Budget tracking + multi-currency expense table
    ├── styles/
    │   └── index.css           # Custom properties, famous grid, responsive layout
    └── utils/
        └── format.ts           # Date and math formatters
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```
Visit `http://localhost:5173/` in your browser.
