# Flipkart Clone — Fullstack Assignment

A fully functional e-commerce platform replicating Flipkart's design and user experience.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Custom CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) with bcryptjs |

## Features

### Core Features
- ✅ Product listing with grid layout (Flipkart-accurate design)
- ✅ Search by product name or brand
- ✅ Filter by category with category chips
- ✅ Sort by price, rating, newest
- ✅ Product detail page with image carousel
- ✅ Product specifications table
- ✅ Add to Cart / Buy Now
- ✅ Shopping cart with quantity management
- ✅ Checkout with shipping address form
- ✅ Order placement with confirmation page

### Bonus Features
- ✅ User Authentication (Login / Signup with JWT)
- ✅ Order History page
- ✅ Wishlist (toggle heart icon on product cards)
- ✅ Email notification on order (console-mocked, configurable via SMTP)
- ✅ Fully responsive design (mobile, tablet, desktop)

## Database Schema

9 tables: `users`, `categories`, `products`, `product_images`, `product_specs`, `cart_items`, `orders`, `order_items`, `wishlists`

## Local Setup

### Prerequisites
- Node.js v16+
- PostgreSQL 14+

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd flipkart-clone
npm install
npm run setup
```

### 2. Set Up PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE USER flipkart_user WITH PASSWORD 'flipkart123';
CREATE DATABASE flipkart_db OWNER flipkart_user;
GRANT ALL PRIVILEGES ON DATABASE flipkart_db TO flipkart_user;
\q
```

### 3. Configure Environment

The `backend/.env` file is pre-configured for local development:
```
DATABASE_URL=postgresql://flipkart_user:flipkart123@localhost:5432/flipkart_db
JWT_SECRET=flipkart_super_secret_jwt_key_2024
PORT=5000
```

### 4. Run Migrations & Seed

```bash
npm run migrate
npm run seed
```

This creates all tables and inserts **50+ products** across **6 categories** along with a demo user:
- Email: `demo@example.com`
- Password: `demo123`

### 5. Start Development Servers

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/products` | List products (search, category, sort, page) |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/categories` | All categories |
| GET | `/api/cart` | View cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Order history |
| GET | `/api/orders/:id` | Order detail |
| GET | `/api/wishlist` | View wishlist |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |

## Assumptions

1. **Guest Mode**: Cart, wishlist, and orders work without logging in using a browser session ID. Login enhances the experience.
2. **Email Notifications**: Order confirmation emails are logged to console. Configure `SMTP_*` variables in `.env` for real emails.
3. **Sample Images**: Product images are sourced from Unsplash (publicly accessible URLs).
4. **Default User**: A demo user (`demo@example.com` / `demo123`) is seeded for quick testing.

## Deployment

- **Frontend**: Deploy `/frontend` to Vercel
- **Backend**: Deploy `/backend` to Render or Railway
- Update `NEXT_PUBLIC_API_URL` in frontend env to point to deployed backend

## Author

Built for Scaler AI Labs — SDE Intern Fullstack Assignment
