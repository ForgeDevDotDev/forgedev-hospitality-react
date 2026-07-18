# ForgeDev Hospitality React

> React frontend for the Hospitality domain — hotel booking platform with search, availability calendar, and reservation flow

**Part of [ForgeDev](https://forgedev.dev)** — Structured work simulation for junior developers.

---

## 📜 License

This project is dual-licensed:

| Version | License | Use Case |
|---------|---------|----------|
| Community | AGPL-3.0 | Free for personal and open-source use. Network service modifications must be published. |
| Commercial | Commercial License | For organizations that want to use this project without AGPL obligations. Contact **info@forgedev.dev** |

See [LICENSE](./LICENSE), [COMMERCIAL-LICENSE.md](./COMMERCIAL-LICENSE.md), and [CLA.md](./CLA.md) for details.

---

## 🤝 Contributing

Contributions are welcome! Please read:

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guide, revenue sharing model, and PR process
- [CLA.md](./CLA.md) — Contributor License Agreement (must sign before merging)

---

## 🏗 Project Structure

```
forgedev-hospitality-react/
├── src/
│   ├── api/
│   │   └── index.ts            # Axios API module (properties, rooms, bookings, guests, pricing, amenities)
│   ├── assets/
│   │   └── main.css            # Global styles
│   ├── components/
│   │   ├── PropertyCard.tsx    # Hotel property card
│   │   ├── BookingCalendar.tsx # Monthly calendar with booked dates
│   │   ├── DateRangePicker.tsx # Check-in / check-out date picker
│   │   ├── GuestFilter.tsx     # Guest count selector
│   │   ├── BookingForm.tsx     # Guest info + booking confirmation form
│   │   └── AmenitiesFilter.tsx # Amenity checkbox filter
│   ├── pages/
│   │   ├── SearchPage.tsx      # Property search with filters + pagination
│   │   ├── PropertyDetailPage.tsx # Property details + room list
│   │   ├── BookingFlowPage.tsx # Booking flow (room → guest info → confirm)
│   │   ├── MyBookingsPage.tsx  # User's bookings list + cancel
│   │   └── AdminDashboardPage.tsx # Property management dashboard
│   ├── stores/
│   │   ├── properties.ts       # Properties store (Zustand — list, search, CRUD)
│   │   ├── bookings.ts         # Bookings store (create, list, cancel)
│   │   └── search.ts           # Search filter state (dates, guests, city, amenities, page)
│   ├── App.tsx                 # Root component with navbar + routes
│   ├── main.tsx                # App entry point
│   └── vite-env.d.ts          # Vite type declarations
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Getting Started

```bash
# Install dependencies
npm install

# Start dev server (proxies /api to localhost:3000)
npm run dev
```

### Key Features

- **Search** with date, guest, city, star rating, and amenity filters
- **Property detail** with room list and availability
- **Booking flow** with guest information form
- **My Bookings** list with cancel functionality
- **Admin dashboard** for property, amenity, and pricing rule management

---

## 🔗 Links

- **ForgeDev:** https://forgedev.dev
- **GitHub Org:** https://github.com/ForgeDevDotDev
- **Contact:** info@forgedev.dev

---

## 📁 Related Repositories

React frontend for the **Hospitality** domain. Connects to:

| Repo | Role |
|------|------|
| forgedev-hospitality-backend | Backend API |
| forgedev-hospitality-vue | Vue frontend (same domain) |
