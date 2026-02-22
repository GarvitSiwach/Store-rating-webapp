# RateWise

A store rating platform with role-based access for users, store owners, and admins.

## Tech Stack

- **Frontend:** React 19, Vite, React Router
- **Backend:** Node.js, Express 5, MySQL
- **Auth:** JWT, bcrypt

## Project Structure

```
ratewise/
├── backend/     # Express API
└── frontend/    # React SPA
```

## Setup

### Prerequisites

- Node.js 18+
- MySQL

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=ratewise
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Roles

- **USER** – Browse and rate stores
- **STORE_OWNER** – Manage owned stores
- **ADMIN** – Admin dashboard and platform management
