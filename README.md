This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Login Accounts (Development)

Use the following accounts seeded in the database:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@proestate.com` | `admin123` | `/admin` (Dark Mode Dashboard) |
| **User** | `user@demo.com` | `admin123` | `/dashboard` (User Dashboard) |

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Monetization System

The project implements a comprehensive monetization system for property listings.

### 1. Listing Limits & Quotas
- **Default Limit**: New users start with **1 listing slot**.
- **Top-Up Model**: Purchasing a package adds to the *cumulative* limit. It is not a tier-replacement system.
    - Example: User has 1 slot + buys 5 slots = 6 total slots.
- **Enforcement**:
    - Checked at `/api/properties` (POST).
    - If `propertyCount >= listingLimit`, the API returns `403 Forbidden`.
    - Frontend (`PostAdWizard`) handles this by redirecting to `/pricing`.

### 2. Account Types
- **Types**: `INDIVIDUAL` (Default), `AGENT`, `AGENCY`.
- **Purpose**: Primarily for verification status and professional branding.
- **Upgrade Flow**:
    1. User submits request via `/account-settings`.
    2. Admin reviews in Admin Dashboard.
    3. Upon approval, `User.accountType` is updated.

### 3. Payment Flow
- **Provider**: Midtrans (Snap/Popup).
- **Mechanism**:
    - `CheckoutProvider` handles the UI and Snap token retrieval.
    - Webhook (`/api/payment/webhook`) updates the database upon `settlement` or `capture`.
