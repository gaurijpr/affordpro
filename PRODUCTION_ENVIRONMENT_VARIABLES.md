# 🔐 PRODUCTION ENVIRONMENT VARIABLES GUIDE (AFFORDPRO BACKEND)

This document details every environment variable required by the **AffordPro Backend Server** for live production deployment.

---

## 📋 ENVIRONMENT VARIABLES TABLE

| Variable Name | Purpose | Example Format | Secret / Public |
| :--- | :--- | :--- | :--- |
| `PORT` | Defines HTTP port for Express server | `5000` | Public |
| `NODE_ENV` | Sets Node execution environment | `production` | Public |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/affordpro?sslmode=require` | 🔒 **SECRET** |
| `JWT_SECRET` | Secret key used to sign & verify JWT login tokens | `affordpro_jwt_live_secret_key_2026_super_secure` | 🔒 **SECRET** |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` | Public |
| `CASHFREE_APP_ID` | Cashfree Merchant App / Client ID | `your_cashfree_app_id_here` | 🔒 **SECRET** |
| `CASHFREE_SECRET_KEY` | Cashfree Merchant Client Secret | `your_cashfree_secret_key_here` | 🔒 **SECRET** |
| `CASHFREE_ENV` | Cashfree API mode (`TEST` or `PRODUCTION`) | `PRODUCTION` | Public |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (Optional secondary PG) | `rzp_live_xxxxxxxxxxxx` | 🔒 **SECRET** |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `xxxxxxxxxxxxxxxxxxxxxxxx` | 🔒 **SECRET** |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook HMAC Verification Secret | `rzp_webhook_secret_key` | 🔒 **SECRET** |
| `FRONTEND_URL` | Primary allowed frontend origin | `https://affordpro.com` | Public |
| `CORS_ORIGIN` | Comma-separated list of allowed CORS origins | `https://affordpro.com,https://www.affordpro.com` | Public |

---

## 🔒 SECURITY RULES FOR PRODUCTION
1. **NEVER** commit `.env` files containing real secret values to Git repositories.
2. **NEVER** expose `JWT_SECRET`, `CASHFREE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, or `DATABASE_URL` in frontend code or client-side JavaScript.
3. Keep all payment verification, HMAC signature validation, and database queries strictly **SERVER-SIDE**.
