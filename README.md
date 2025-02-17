# Open Spice Society

A social networking platform built with Nuxt.js, Supabase, TailwindCSS, and PrimeVue, integrated with Shopify's Storefront API for authentication.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anonymous key
- `SHOPIFY_STOREFRONT_DOMAIN`: Your Shopify store domain
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Your Shopify Storefront API access token

## Development

The application uses:
- Nuxt 3 for the framework
- Supabase for backend and authentication
- TailwindCSS for styling
- PrimeVue for UI components
- Shopify Storefront API for user authentication

## Production

For production deployment:
1. Create a separate `.env.production` file with production environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm run preview
   ```
