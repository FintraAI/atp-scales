// src/lib/site.ts
// Centralized URL and domain configuration

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  'http://localhost:3000'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
