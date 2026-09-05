# AffordPro REST API Documentation

**Version**: `1.0.0`  
**Base URL**: `http://localhost:5000/api/v1`

---

## Standard Response Format

### Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description message"
}
```

---

## 1. System Health Endpoint

### GET `/health`
- **Description**: Verify backend server status and database connectivity.
- **Authentication**: None
- **Response**:
```json
{
  "success": true,
  "message": "AffordPro API is running",
  "timestamp": "2026-08-26T18:30:00.000Z"
}
```

---

## 2. Product Endpoints

### GET `/products`
- **Description**: Fetch products with optional filtering, sorting, and search query parameters.
- **Query Parameters**:
  - `category`: Category slug (e.g. `canva-templates`)
  - `type`: ProductType (`DIGITAL_PRODUCT`, `TEMPLATE`, `COURSE`, `SERVICE`, `BUNDLE`)
  - `q`: Search keyword
  - `sort`: Sorting option (`featured`, `price-asc`, `price-desc`, `rating`, `newest`)
  - `minPrice`, `maxPrice`: Numeric price range
  - `minRating`: Minimum star rating (e.g. `4.5`)
- **Response**:
```json
[
  {
    "id": "prod-1000-reels",
    "slug": "1000-viral-reels-bundle",
    "title": "1000+ Viral Reels & Canva Pack",
    "shortDescription": "High-converting editable reels templates",
    "fullDescription": "Complete viral reels toolkit...",
    "category": "Reels Bundles",
    "categorySlug": "reels-bundles",
    "productType": "DIGITAL_PRODUCT",
    "images": ["/reels.jpg"],
    "price": 499,
    "compareAtPrice": 1499,
    "discount": 67,
    "currency": "₹",
    "rating": 4.9,
    "reviewCount": 142,
    "features": ["1000+ HD Videos"],
    "whatIsIncluded": ["Canva links"],
    "whoIsThisFor": ["Creators"],
    "requirements": ["Free Canva Account"],
    "status": "IN_STOCK",
    "downloadable": true,
    "serviceBased": false,
    "featured": true,
    "bestSeller": true,
    "newArrival": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### GET `/products/:slug`
- **Description**: Get single product by URL slug.
- **Response**: `Product` object or HTTP 404 error if not found.

### GET `/products/featured`
- **Description**: Get featured homepage products.

### GET `/products/best-selling`
- **Description**: Get top rated best seller products.

### GET `/products/new`
- **Description**: Get freshly added new arrivals.

### GET `/products/:slug/related`
- **Description**: Get 4 related products based on category/type.

---

## 3. Category Endpoints

### GET `/categories`
- **Description**: Fetch all active categories with product counts.
- **Response**:
```json
[
  {
    "id": "cat-reels",
    "name": "Reels Bundles",
    "slug": "reels-bundles",
    "description": "Ready-to-use viral reels",
    "icon": "Video",
    "productCount": 12,
    "featured": true
  }
]
```

### GET `/categories/:slug`
- **Description**: Fetch single category details by slug.

---

## 4. User Authentication Endpoints

### POST `/auth/register`
- **Request Body**:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210",
  "password": "Password123"
}
```
- **Response**:
```json
{
  "user": {
    "id": "usr-uuid",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+91 98765 43210",
    "createdAt": "2026-08-26"
  },
  "token": "jwt_bearer_token_string"
}
```

### POST `/auth/login`
- **Request Body**:
```json
{
  "email": "rahul@example.com",
  "password": "Password123"
}
```
- **Response**: Same as Register response.

### POST `/auth/forgot-password`
- **Request Body**: `{ "email": "user@example.com" }`

### GET `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current authenticated User profile object.

### PUT `/user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ "name": "Rahul S", "phone": "+91..." }`
- **Response**: Updated User object.

---

## 5. Orders & Payments Endpoints

### POST `/orders`
- **Description**: Create a new customer order.
- **Request Body**:
```json
{
  "customerName": "Rahul Sharma",
  "customerEmail": "rahul@example.com",
  "customerPhone": "+91 98765 43210",
  "items": [
    {
      "product": { "id": "prod-1000-reels", "title": "...", "images": ["..."], "productType": "DIGITAL_PRODUCT", "price": 499, "downloadUrl": "..." },
      "quantity": 1
    }
  ],
  "paymentMethod": "RAZORPAY",
  "couponCode": "WELCOME50",
  "totalAmount": 499
}
```
- **Response**: Full `Order` object with calculated subtotal, discounts, and payment status `UNPAID`.

### GET `/orders/:id`
- **Description**: Get single order details receipt.

### GET `/user/orders`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Fetch all historical orders for authenticated user.

### POST `/payments/create-order`
- **Description**: Initialize Razorpay order session.
- **Request Body**:
```json
{
  "orderId": "ord-uuid",
  "amount": 499,
  "gateway": "RAZORPAY"
}
```
- **Response**:
```json
{
  "sessionId": "rzp_order_id_string",
  "orderId": "ord-uuid",
  "amount": 499,
  "currency": "INR",
  "gateway": "RAZORPAY",
  "keyId": "rzp_test_your_key_id"
}
```

### POST `/payments/verify`
- **Description**: Verify Razorpay payment signature and mark order as `PAID`.
- **Request Body**:
```json
{
  "paymentId": "pay_xyz123",
  "orderId": "ord-uuid",
  "signature": "razorpay_signature_hash"
}
```
- **Response**: `{ "success": true, "message": "Payment verified successfully" }`

### POST `/payments/webhook`
- **Description**: Asynchronous Razorpay webhook handler to guarantee payment processing.

---

## 6. Coupons Endpoints

### GET `/coupons/validate`
- **Query Parameters**: `code=WELCOME50&total=499`
- **Response**:
```json
{
  "valid": true,
  "coupon": {
    "code": "WELCOME50",
    "discountType": "percentage",
    "discountValue": 50,
    "description": "50% OFF Welcome Discount",
    "expiryDate": "2026-12-31"
  },
  "message": "Coupon WELCOME50 applied successfully!"
}
```

---

## 7. Product Reviews Endpoints

### GET `/products/:id/reviews`
- **Description**: Fetch customer reviews for a given product.

### POST `/products/:id/reviews`
- **Headers**: `Authorization: Bearer <token>` (Optional/Recommended)
- **Request Body**: `{ "rating": 5, "title": "Amazing", "comment": "Great templates!", "userName": "Rahul" }`

---

## 8. Protected Digital Product Downloads

### GET `/downloads/:orderId/:productId`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Access protected digital file download link after verifying order ownership & payment status.

---

## 9. Admin Endpoints (`/api/v1/admin/*`)

- **POST `/admin/products`**: Create product (returns new Product)
- **PUT `/admin/products/:id`**: Update existing product fields
- **DELETE `/admin/products/:id`**: Deactivate / soft delete product
- **GET `/admin/orders`**: View & filter customer orders
- **PATCH `/admin/orders/:id/status`**: Change order/payment status
- **POST `/admin/categories`**: Add category
- **POST `/admin/coupons`**: Create promo coupon code
- **GET `/admin/dashboard`**: Returns sales total, order count, user count metrics
