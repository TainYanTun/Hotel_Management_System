# Hotel Management System

A professional, high-fidelity Hotel Management System built with React, Express, and PostgreSQL (Neon). Designed with a premium Stripe-inspired aesthetic.

## 🏛️ Project Architecture

The project follows a clean separation of concerns:
- **`/client`**: React 19 + Vite frontend.
- **`/server`**: Node.js + Express backend.
- **Cloud Database**: Managed PostgreSQL via [Neon](https://neon.tech/).

## 🚀 Getting Started

### Prerequisites
- Node.js installed.
- Neon account for cloud database (already configured in `.env`).

### Installation
Run the following command in the root directory to install all dependencies:
```bash
npm run install:all
```

### Development
Start both the frontend and backend simultaneously:
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5001](http://localhost:5001)

### Database Migration
If you need to re-initialize the database schema:
```bash
npm run db:init
```

### Deployment
The project is configured for a monolith-style deployment where the Express server serves the React app:
1. Build the frontend: `npm run build`
2. Start the server: `npm run start`

## 🎨 Design System
Based on the Stripe design philosophy:
- **Typography**: Sohne-style variables.
- **Borders**: Conservative 4px–8px radius.
- **Shadows**: Multi-layered, blue-tinted shadows.
- **Palette**: Deep purples, clean whites, and high-contrast text.

## 📄 License
Private Project - Hotel Hub Team.
