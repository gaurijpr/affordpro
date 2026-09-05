# AffordPro Backend Integration Plan

## 1. Existing Frontend Technology & Architecture

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Routing**: React Router DOM v7
- **State Management**: React Context (`CartContext`, `WishlistContext`, `AuthContext`, `ToastContext`)
- **API Abstraction Layer**: `src/services/api.ts` configured with `VITE_API_BASE_URL` and `VITE_USE_MOCK_DATA` fallback.
- **Current Development Port**: `http://localhost:3000`

---

## 2. Existing Frontend Routes

| Route | Page Component | Purpose | Data Dependency |
| --- | --- | --- | --- |
| `/` | `Home.tsx` | Hero, Value Propositions, Best Sellers, Services, New Arrivals, CTA | Products (Featured, Best Sellers, New Arrivals, Services) |
| `/products` | `Products.tsx` | Marketplace catalog with filtering, sorting, price range, categories | Products (Filtered, Sorted, Paginated), Categories |
| `/product/:slug` | `ProductDetail.tsx` | Single product showcase, features, reviews, download/service info | Product by slug, Related Products, Reviews |
| `/categories` | `Categories.tsx` | Browse product categories grid | Categories list |
| `/search` | `Search.tsx` | Search results for products/courses/templates | Products (search query match) |
| `/cart` | `Cart.tsx` | Shopping cart view, coupon validation | Cart items, Coupon validation |
| `/checkout` | `Checkout.tsx` | Order summary, customer details, Razorpay payment gateway trigger | Order creation, Razorpay session creation & verification |
| `/order-success/:orderId` | `OrderSuccess.tsx` | Purchase confirmation receipt & instant download links | Order details by ID |
| `/login` | `Login.tsx` | User login form | `POST /auth/login` |
| `/register` | `Register.tsx` | User registration form | `POST /auth/register` |
| `/forgot-password` | `ForgotPassword.tsx` | Reset password request form | `POST /auth/forgot-password` |
| `/account` | `Account.tsx` | User dashboard tabs: Overview, Orders, Downloads, Courses, Wishlist, Profile | User profile, User Orders, Wishlist |
| `/about` | `About.tsx` | Company information & brand story | Static |
| `/contact` | `Contact.tsx` | Support inquiry form | Contact submission (optional API) |
| `/faq` | `FAQ.tsx` | Knowledge base & common questions | Static |
| `/terms` | `Terms.tsx` | Terms & Conditions legal policy | Static |
| `/privacy-policy` | `PrivacyPolicy.tsx` | Privacy policy document | Static |
| `/refund-policy` | `RefundPolicy.tsx` | Refund & cancellation policies | Static |

---

## 3. Existing Frontend Data Models

### A. Product Model (`Product`)
- `id`: string (UUID)
- `slug`: string (Unique URL slug)
- `title`: string
- `shortDescription`: string
- `fullDescription`: string
- `category`: string (Category Name)
- `categorySlug`: string (Category URL Slug)
- `productType`: `'DIGITAL_PRODUCT' | 'TEMPLATE' | 'COURSE' | 'SERVICE' | 'BUNDLE'`
- `images`: string[] (Array of image URLs)
- `video`: string (Optional video preview URL)
- `price`: number
- `compareAtPrice`: number (Original strike-through price)
- `discount`: number (Calculated discount percentage e.g. 67)
- `currency`: string (`'₹'`)
- `rating`: number (Average rating e.g. 4.9)
- `reviewCount`: number
- `features`: string[]
- `whatIsIncluded`: string[]
- `whoIsThisFor`: string[]
- `requirements`: string[]
- `format`: string (Optional e.g. `'ZIP'`, `'Canva'`, `'PDF'`)
- `deliveryMethod`: string (Optional e.g. `'Instant Download'`, `'Service: 2-3 Days'`)
- `deliveryTime`: string
- `accessDuration`: string
- `courseDuration`: string
- `lessons`: number
- `level`: string
- `tags`: string[]
- `status`: `'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER'`
- `downloadable`: boolean
- `serviceBased`: boolean
- `featured`: boolean
- `bestSeller`: boolean
- `newArrival`: boolean
- `fileSize`: string
- `templateCount`: number
- `downloadUrl`: string (Protected file link)
- `createdAt`: string (ISO Date)
- `updatedAt`: string (ISO Date)

### B. User Model (`User`)
- `id`: string
- `name`: string
- `email`: string
- `phone`: string
- `role`: `'USER' | 'ADMIN'`
- `createdAt`: string

### C. Order Model (`Order`) & OrderItem
- `id`: string
- `orderNumber`: string (e.g. `AP-2026-9481`)
- `date`: string
- `customerName`: string
- `customerEmail`: string
- `customerPhone`: string
- `items`: `OrderItem[]` (`productId`, `productTitle`, `productImage`, `productType`, `price`, `quantity`, `downloadUrl`, `accessUrl`)
- `subtotal`: number
- `discount`: number
- `tax`: number
- `total`: number
- `paymentMethod`: string
- `paymentStatus`: `'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED'`
- `orderStatus`: `'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'`
- `couponCode`: string

### D. Category Model (`Category`)
- `id`: string, `name`: string, `slug`: string, `description`: string, `icon`: string, `image`: string, `productCount`: number, `featured`: boolean

### E. Coupon Model (`Coupon`)
- `code`: string, `discountType`: `'percentage' | 'fixed'`, `discountValue`: number, `minOrderAmount`: number, `maxDiscount`: number, `description`: string, `expiryDate`: string

### F. Review Model (`Review`)
- `id`: string, `productId`: string, `userName`: string, `userAvatar`: string, `rating`: number, `title`: string, `comment`: string, `date`: string, `verifiedPurchase`: boolean

---

## 4. Backend Database Schema (Prisma PostgreSQL)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

enum ProductType {
  DIGITAL_PRODUCT
  TEMPLATE
  COURSE
  SERVICE
  BUNDLE
}

enum ProductStatus {
  IN_STOCK
  OUT_OF_STOCK
  PRE_ORDER
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
  FAILED
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
}

enum ServiceStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  DELIVERED
  COMPLETED
  CANCELLED
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  phone         String?
  passwordHash  String
  role          Role      @default(USER)
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders        Order[]
  reviews       Review[]
  wishlists     Wishlist[]
}

model Category {
  id           String    @id @default(uuid())
  name         String
  slug         String    @unique
  description  String?
  icon         String    @default("Folder")
  image        String?
  displayOrder Int       @default(0)
  featured     Boolean   @default(false)
  active       Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  products     Product[]
}

model Product {
  id               String        @id @default(uuid())
  slug             String        @unique
  title            String
  shortDescription String
  fullDescription  String
  categoryId       String
  category         Category      @relation(fields: [categoryId], references: [id])
  productType      ProductType
  images           String[]
  video            String?
  price            Float
  compareAtPrice   Float?
  discount         Float?
  currency         String        @default("₹")
  rating           Float         @default(5.0)
  reviewCount      Int           @default(0)
  features         String[]
  whatIsIncluded   String[]
  whoIsThisFor     String[]
  requirements     String[]
  format           String?
  deliveryMethod   String?
  deliveryTime     String?
  accessDuration   String?
  courseDuration   String?
  lessons          Int?
  level            String?
  tags             String[]
  status           ProductStatus @default(IN_STOCK)
  downloadable     Boolean       @default(true)
  serviceBased     Boolean       @default(false)
  featured         Boolean       @default(false)
  bestSeller       Boolean       @default(false)
  newArrival       Boolean       @default(false)
  fileSize         String?
  templateCount    Int?
  downloadUrl      String?
  active           Boolean       @default(true)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  orderItems       OrderItem[]
  reviews          Review[]
  wishlists        Wishlist[]
}

model Order {
  id             String        @id @default(uuid())
  orderNumber    String        @unique
  userId         String?
  user           User?         @relation(fields: [userId], references: [id])
  customerName   String
  customerEmail  String
  customerPhone  String?
  subtotal       Float
  discount       Float         @default(0)
  tax            Float         @default(0)
  total          Float
  paymentMethod  String        @default("RAZORPAY")
  paymentStatus  PaymentStatus @default(UNPAID)
  orderStatus    OrderStatus   @default(PENDING)
  couponCode     String?
  razorpayOrderId   String?
  razorpayPaymentId String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  items          OrderItem[]
  services       ServiceOrder[]
}

model OrderItem {
  id           String      @id @default(uuid())
  orderId      String
  order        Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId    String
  product      Product     @relation(fields: [productId], references: [id])
  productTitle String
  productImage String
  productType  ProductType
  price        Float
  quantity     Int         @default(1)
  downloadUrl  String?
  accessUrl    String?
}

model ServiceOrder {
  id           String        @id @default(uuid())
  orderId      String        @unique
  order        Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  status       ServiceStatus @default(PENDING)
  requirements String?
  notes        String?
  deliveredAt  DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Coupon {
  id             String    @id @default(uuid())
  code           String    @unique
  discountType   String    @default("percentage") // "percentage" | "fixed"
  discountValue  Float
  minOrderAmount Float?
  maxDiscount    Float?
  description    String
  expiryDate     DateTime
  usageLimit     Int?
  usageCount     Int       @default(0)
  active         Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Review {
  id               String   @id @default(uuid())
  productId        String
  product          Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId           String?
  user             User?    @relation(fields: [userId], references: [id])
  userName         String
  userAvatar       String?
  rating           Int      // 1-5
  title            String
  comment          String
  verifiedPurchase Boolean  @default(true)
  approved         Boolean  @default(true)
  createdAt        DateTime @default(now())
}

model Wishlist {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}
```

---

## 5. Frontend Services → API Mapping Table

| Frontend Service Method | Backend Endpoint | HTTP Method | Auth Required | Description |
| --- | --- | --- | --- | --- |
| `productService.getProducts(filters)` | `/api/v1/products` | GET | No | Fetch filtered & sorted products catalog |
| `productService.getProductBySlug(slug)` | `/api/v1/products/:slug` | GET | No | Fetch single product by slug |
| `productService.getFeaturedProducts()` | `/api/v1/products/featured` | GET | No | Fetch featured homepage products |
| `productService.getBestSellers()` | `/api/v1/products/best-selling` | GET | No | Fetch best seller products |
| `productService.getNewArrivals()` | `/api/v1/products/new` | GET | No | Fetch new arrival products |
| `productService.getCourses()` | `/api/v1/products?type=COURSE` | GET | No | Fetch course catalog |
| `productService.getServices()` | `/api/v1/products?type=SERVICE` | GET | No | Fetch done-for-you services |
| `productService.getRelatedProducts(product)` | `/api/v1/products/:slug/related` | GET | No | Fetch related recommendations |
| `categoryService.getCategories()` | `/api/v1/categories` | GET | No | Fetch category list |
| `categoryService.getCategoryBySlug(slug)` | `/api/v1/categories/:slug` | GET | No | Fetch category details by slug |
| `authService.login(email, password)` | `/api/v1/auth/login` | POST | No | Authenticate user & generate JWT |
| `authService.register(name, email, phone, pass)`| `/api/v1/auth/register` | POST | No | Register new user |
| `authService.forgotPassword(email)` | `/api/v1/auth/forgot-password` | POST | No | Request password reset link |
| `authService.updateProfile(user)` | `/api/v1/user/profile` | PUT | Yes (JWT) | Update user profile details |
| `orderService.createOrder(data)` | `/api/v1/orders` | POST | Optional | Create new purchase order |
| `orderService.getOrderById(id)` | `/api/v1/orders/:id` | GET | Optional | Fetch order details receipt |
| `orderService.getUserOrders()` | `/api/v1/user/orders` | GET | Yes (JWT) | Fetch order history for user |
| `paymentService.createPaymentSession(orderId)` | `/api/v1/payments/create-order` | POST | No | Create Razorpay order ID |
| `paymentService.verifyPayment(...)` | `/api/v1/payments/verify` | POST | No | Verify Razorpay payment signature |
| `couponService.validateCoupon(code, total)` | `/api/v1/coupons/validate` | GET | No | Validate promo coupon code |
| `reviewService.getProductReviews(productId)` | `/api/v1/products/:id/reviews` | GET | No | Fetch reviews for product |
| `reviewService.addReview(productId, review)` | `/api/v1/products/:id/reviews` | POST | Yes (JWT) | Post customer review |

---

## 6. Admin API Mapping

| Resource | Admin Endpoint | Method | Auth Required | Description |
| --- | --- | --- | --- | --- |
| Products | `/api/v1/admin/products` | GET / POST | Admin JWT | List all / Create product |
| Product Detail | `/api/v1/admin/products/:id` | PUT / PATCH / DELETE | Admin JWT | Update / Toggle status / Delete |
| Categories | `/api/v1/admin/categories` | GET / POST / PUT | Admin JWT | Manage category catalog |
| Orders | `/api/v1/admin/orders` | GET | Admin JWT | List & search customer orders |
| Order Status | `/api/v1/admin/orders/:id/status` | PATCH | Admin JWT | Update order or payment status |
| Coupons | `/api/v1/admin/coupons` | GET / POST / DELETE | Admin JWT | Manage promo codes |
| Users | `/api/v1/admin/users` | GET / PATCH | Admin JWT | Manage user accounts |
| Dashboard | `/api/v1/admin/dashboard` | GET | Admin JWT | Metrics, revenue & sales counts |
