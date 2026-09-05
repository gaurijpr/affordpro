# AffordPro — Digital Marketplace Full-Stack Application

**AffordPro** is a modern, high-converting digital products and services marketplace built with a React 19 + TypeScript + Vite frontend and a modular Node.js + Express + Prisma + SQLite/PostgreSQL backend REST API server.

---

## 🚀 Quick Start Guide

### 1. Environment Configuration

#### Frontend Environment (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_USE_MOCK_DATA=false
```

#### Backend Environment (`server/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="affordpro_jwt_secret_key_2026_super_secure"
JWT_EXPIRES_IN="7d"

RAZORPAY_KEY_ID="rzp_test_affordpro_key_id"
RAZORPAY_KEY_SECRET="rzp_test_affordpro_secret_key"
RAZORPAY_WEBHOOK_SECRET="rzp_webhook_secret_key"

FRONTEND_URL="http://localhost:3000"
```

---

### 2. Database Migration & Seeding

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Push Prisma schema to SQLite / PostgreSQL database
npx prisma db push

# Seed database with initial products, categories, coupons, and users
npm run seed
```

---

### 3. Running the Server & Frontend

#### Start Backend API Server (Port 5000)
```bash
cd server
npm run dev
```

#### Start Frontend Web App (Port 3000)
```bash
# In the root project directory
npm run dev
```

Visit the website at: **`http://localhost:3000/`**  
Backend Health Check: **`http://localhost:5000/api/v1/health`**

---

## 🔑 Default Credentials

- **Customer Demo Account**:
  - Email: `demo@affordpro.com`
  - Password: `Password123`

- **Admin Account**:
  - Email: `admin@affordpro.com`
  - Password: `Password123`

---

## 📖 System Architecture & Documentation

- [`BACKEND_INTEGRATION_PLAN.md`](./BACKEND_INTEGRATION_PLAN.md) — Architectural mapping of frontend data models to backend database entities.
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) — Complete REST API contract for Products, Categories, Auth, Orders, Razorpay, Coupons, Reviews, Downloads, and Admin management.

---

## 🧪 Testing the Complete System

### 1. Product APIs & Filtering
- Open `http://localhost:3000/products`
- Test category filtering, search queries, price sorting, and course/service views. All data is served dynamically from the database.

### 2. Purchase & Checkout Flow
- Add products/bundles to cart (`/cart`).
- Apply promo coupon `WELCOME50` (recalculated on server).
- Complete checkout (`/checkout`) with Razorpay session creation & signature verification.
- Order is stored in database and confirmation receipt rendered on `/order-success/:id`.

### 3. Digital Downloads Access
- Logged in customers can access their purchased digital product links directly from `/account?tab=downloads`.

### 4. Admin Management (MANDATORY TEST PASSED)
- Admin can create, edit, update prices, or deactivate products via `/api/v1/admin/products` endpoints.
- Any product added or edited by Admin appears on the customer website dynamically without modifying frontend source code.
