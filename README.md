# Freight Quotes — React SPA

A React single-page app for ocean freight quotes and bookings.

## Features

- Quote lookup with multi-select **Origin**, **Destination**, and **Container**
- Client-side join of nested data:  
  `(origin,destination) → portPairId → quote → rates[containerId]`
- **Book Now** flow (prefilled booking) and **manual booking** from Home/Nav
- **Select multiple results and Book Selected** to step through multiple bookings
- All fields required with asterisks and custom validation alerts on submit
- Persist booking (`POST /bookings`) and update app state on response
- Bookings index available at `/bookings` (link from confirmation)
- Routes: `/`, `/quote`, `/quote/result`, `/booking`, `/booking/confirmation`, `/bookings`

## Tech

- React (Create React App)
- React Router
- `json-server`
- Plain CSS

---

## Project Structure

```text
my-app/                  # React frontend (CRA)
  public/
  src/
    components/
      NavBar.js
      Home.js
      QuoteForm.js
      QuoteResult.js
      BookingForm.js
      BookingConfirmation.js
      BookingsList.js
    utils/
      api.js             # fetchJson helper
      rates.js           # findRateForLane()
    App.js
    App.css
    index.js
  .env.development       # REACT_APP_API_URL=http://localhost:3001
  package.json

reactshipping-backend/   # json-server backend
  db.json
  package.json
```

---

## Environment Variables

Create **`my-app/.env.development`** with:

```env
REACT_APP_API_URL=http://localhost:3001
```

For production, either set the env var in your hosting settings or create `my-app/.env.production`:

```env
REACT_APP_API_URL=https://your-backend-host
```

After editing `.env*` files, restart `npm start`.

## Quick Start

### Backend (json-server)

```bash
cd reactshipping-backend
npm install           # if package.json includes json-server
npm start             # runs: json-server --watch db.json --port 3001
```

### Frontend (React)

```bash
cd my-app
npm install
npm start             # http://localhost:3000
```

---

## Using the App

1. Open Quote:

   - Select one or more **Origins**, **Destinations**, and **Containers**
   - Click **Show Quotes**

2. On Quote Results:

   - Use **Book Now** on a single row, or
   - Tick checkboxes and click **Book Selected** to step through multiple bookings

3. On Booking:
   - If coming from Book Now or Book Selected, the lane and container are prefilled
   - Fill Name, Company, Email and **Confirm Booking**
   - On the confirmation screen, use **Book next selection** or **View all bookings**

---

## API Overview (json-server)

Top-level routes from db.json:

- GET /portPairs

- GET /containers

- GET /quotes (each quote has nested rates with container charges)

- GET /bookings

- POST /bookings

## Example quote:

```json
{
  "id": 1,
  "portPairId": 1,
  "transitTime": "18d",
  "rates": [
    { "containerId": 1, "freight": 1000, "thc": 100, "doc": 50, "dhc": 90, "lss": 25 },
    { "containerId": 2, "freight": 1200, "thc": 100, "doc": 50, "dhc": 90, "lss": 25 }
  ]
}
```

## Example booking payload:

```json
{
  "origin": "Melbourne",
  "destination": "Shanghai",
  "containerType": "40GP",
  "transitTime": "18d",
  "charges": { "freight": 1234, "thc": 100, "doc": 50, "dhc": 90, "lss": 25 },
  "customer": {
    "name": "Ada Lovelace",
    "company": "Analytical Engines",
    "email": "ada@example.com"
  },
  "createdAt": "2025-08-13T03:21:00.000Z"
}
```

On POST success, the app calls `addBooking(saved)` to update state before navigating to confirmation.

> **Note:** Nested JSON (intentional)  
> `json-server` cannot filter nested arrays, so the app fetches once and resolves matches on the client:
>
> ```text
> (origin, destination) → portPairId → quote → rates.find(r.containerId === selectedId)
> ```

## Build & Deploy

```text
npm run build
```

For Netlify + React Router, add `public/_redirects`:

```text
/*  /index.html  200
```

Set REACT_APP_API_URL in your hosting env for production.
