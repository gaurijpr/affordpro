# 🏨 HOSTINGER BACKEND DEPLOYMENT GUIDE (AFFORDPRO)

This guide provides step-by-step instructions to deploy the **AffordPro Backend API Server** to **Hostinger** (using either Hostinger Node.js Application Manager or Hostinger VPS).

---

## 🎯 BACKEND SPECIFICATIONS & REQUIREMENT SUMMARY

* **Framework**: Node.js 18.x / 20.x + Express 4
* **Language**: TypeScript (Compiled to Node.js ES Modules in `dist/`)
* **Database**: PostgreSQL (Cloud PostgreSQL or Hostinger PostgreSQL)
* **ORM**: Prisma 6 (`@prisma/client`)
* **Package Manager**: `npm`
* **Entry Point File**: `dist/index.js`
* **Port**: Configurable via `PORT` (Defaults to `5000`)
* **Expected Live API Base URL**: `https://api.affordpro.com/api/v1`

---

## 📋 DEPLOYMENT METHOD 1: HOSTINGER NODE.JS APPLICATION MANAGER (hPanel)

### STEP 1: Set Up Cloud PostgreSQL Database
1. Create a PostgreSQL database on **Hostinger Database Manager** or **[Neon.tech](https://neon.tech/)** / **[Supabase.com](https://supabase.com/)**.
2. Copy your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:5432/affordpro_db?sslmode=require"
   ```

---

### STEP 2: Configure Node.js Application in Hostinger hPanel
1. Log in to **[Hostinger hPanel](https://hpanel.hostinger.com/)**.
2. Go to **Advanced** ➔ **Setup Node.js App** (or **Node.js Selector**).
3. Click **Create Application**:
   * **Node.js Version**: `18.x` or `20.x`
   * **Application Mode**: `Production`
   * **Application Root**: `server` (or root if using dedicated backend subdomain)
   * **Application URL**: `api.affordpro.com`
   * **Application Startup File**: `dist/index.js`

---

### STEP 3: Upload Backend Files
1. Open **File Manager** ➔ Navigate to your application root folder.
2. Upload **`affordpro-hostinger-backend.zip`** (located at `E:\Antigravity Project\Affordpro\affordpro-hostinger-backend.zip`).
3. Extract the ZIP file. Verify the directory contains:
   ```text
   server/ (or root)
   ├── dist/
   │   └── index.js
   ├── prisma/
   │   └── schema.prisma
   ├── package.json
   └── package-lock.json
   ```

---

### STEP 4: Configure Environment Variables in Hostinger
Under **Environment Variables** in Hostinger Node.js Manager, add:

```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://username:password@hostname:5432/affordpro_db?sslmode=require"
JWT_SECRET="your_secure_jwt_secret_key_2026"
JWT_EXPIRES_IN="7d"
CASHFREE_APP_ID="your_cashfree_app_id_here"
CASHFREE_SECRET_KEY="your_cashfree_secret_key_here"
CASHFREE_ENV="PRODUCTION"
FRONTEND_URL="https://affordpro.com"
CORS_ORIGIN="https://affordpro.com,https://www.affordpro.com"
```

---

### STEP 5: Run NPM Install & Prisma Database Migration
In Hostinger Node.js Application Manager or SSH Terminal:
1. Click **Run NPM Install** (or `npm install --production`).
2. Run Prisma Database Migration:
   ```bash
   npx prisma db push
   ```
   *(This creates all database tables: User, Category, Product, Order, OrderItem, ServiceOrder, Coupon, Review, Wishlist).*

3. (Optional) Run Database Seed for initial product catalog:
   ```bash
   npm run seed
   ```

4. Click **Restart Application**.

---

## 🚀 DEPLOYMENT METHOD 2: HOSTINGER VPS (UBUNTU 22.04 / 24.04)

If using Hostinger VPS:

1. Connect to VPS via SSH:
   ```bash
   ssh root@YOUR_HOSTINGER_VPS_IP
   ```
2. Install Node.js 20 & PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx
   sudo npm install -g pm2
   ```
3. Upload backend code to `/var/www/affordpro-backend`.
4. Install dependencies & run Prisma migration:
   ```bash
   cd /var/www/affordpro-backend
   npm install
   npx prisma db push
   ```
5. Start server using PM2:
   ```bash
   pm2 start dist/index.js --name affordpro-backend
   pm2 save
   pm2 startup
   ```
6. Set up Nginx Proxy & Certbot SSL:
   ```nginx
   server {
       server_name api.affordpro.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   ```bash
   sudo certbot --nginx -d api.affordpro.com
   ```

---

## 🧪 TESTING THE DEPLOYED BACKEND API

1. **Test Health Endpoint**:
   ```bash
   curl https://api.affordpro.com/api/v1/health
   ```
   *Expected Response*:
   ```json
   { "success": true, "message": "AffordPro API is running", "timestamp": "..." }
   ```

2. **Test Products API Endpoint**:
   ```bash
   curl https://api.affordpro.com/api/v1/products
   ```

3. **Test Categories API Endpoint**:
   ```bash
   curl https://api.affordpro.com/api/v1/categories
   ```
