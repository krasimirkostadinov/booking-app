# Booking Manager

Single-page React app for creating and managing property bookings.

## Features

- CRUD operations (create, read, update, delete)
- Overlap validation – prevents double bookings for the same dates
- Responsive layout – desktop and mobile

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Zustand (persist middleware)
- React Hook Form + Zod
- date-fns

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test:run
```

Test suites: schema validation, store, date overlap utility, BookingForm, BookingList.
