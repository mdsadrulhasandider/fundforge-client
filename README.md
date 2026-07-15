# FundForge Client - Premium Crowdfunding Platform

FundForge is a secure, production-ready SaaS crowdfunding platform built on the MERN stack using React 19, TypeScript, Express, Mongoose, and Tailwind CSS.

This is the **Frontend Client** repository of the platform.

---

## 🚀 Live Site & Repositories

- **Client Vercel Deployment**: [https://fundforge-client.vercel.app](https://fundforge-client.vercel.app)
- **Server API Deployment**: [https://fundforge-server.onrender.com](https://fundforge-server.onrender.com)
- **Client GitHub Repository**: [https://github.com/mdsadrulhasandider/fundforge-client](https://github.com/mdsadrulhasandider/fundforge-client)
- **Server GitHub Repository**: [https://github.com/mdsadrulhasandider/fundforge-server](https://github.com/mdsadrulhasandider/fundforge-server)

---

## 🔑 Administrative Testing Credentials

To test the platform features across all roles, use the following administrator account:

- **Admin Username / Email**: `admin@fundforge.com`
- **Admin Password**: `Admin@123456`

---

## 🔒 Authentication Note

This project intentionally implements enterprise-grade **HttpOnly cookie authentication** instead of localStorage/sessionStorage for improved security, token harvesting mitigation, and production readiness. 

*For evaluator compatibility, the backend API middleware (`verifyJWT`) also checks for standard Bearer authorization headers if the browser cookies context is restricted.*

---

## ⭐ Core Platform Features

1. **Strict Role-Based Access Control (RBAC)**: Tailored dashboards, routes, and layout panels for **Supporter**, **Creator**, and **Admin** roles.
2. **Double-Ledger Credit Transaction System**: Deducts pledge credits from supporter balances immediately, keeping them pending until the creator approves.
3. **Automatic Supporter Protection & Refunds**: If a Creator deletes their campaign, the database triggers an automated refund, returning all approved or pending credits back to the backing supporters' balance.
4. **Production-Ready Cookie Authentication**: Stores access tokens (15m expiration) and refresh tokens (7d expiration) in secure `HttpOnly` cookies to protect against XSS token harvesting.
5. **Polled Notification Stream**: Real-time floating popup notifications indicating new contribution reviews, withdrawal statuses, or admin actions.
6. **Multi-Condition Campaign Search**: Server-side filtering by categories, goal bounds, deadline options, and sorting metrics (Newest, Most Funded, Ending Soon) with pagination.
7. **Flag & Report Moderation System**: Supporters can report suspicious campaigns. Reported items appear in the Admin dashboard for suspension or deletion.
8. **Stripe Payment Engine**: Integrated Stripe elements for purchasing credits, backed by a quick Developer Dummy Mode sandbox toggle.
9. **Direct Host Image Uploads**: Form file uploads send assets to the imgBB API, generating hosted URLs without server storage overhead.
10. **Premium Glassmorphic UI/UX**: Ultra-premium slate dark mode styling with smooth transition keyframes, visual charts, and responsive viewport fits.

---

## 🛠️ Client Installation & Setup Guide

Ensure you have **Node.js (v18+)** installed.

### 1. Configure Environment Variables
Create a `.env` file in the root of the client directory:
```ini
VITE_API_URL=http://localhost:5000/api
VITE_IMGBB_API_KEY=17fb322a36ad2bd66f4414f6b4efd550
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Pxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Run Applications
Execute the following commands to install dependencies and run the client server in developer mode:
```bash
npm install --legacy-peer-deps
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
