# SubTracker

A subscription tracking and management app built with React Native (Expo), Supabase, and modern tooling. Track, manage, and optimize your recurring subscriptions across iOS, Android, and Web.

## Features

- **Dashboard** — Overview of monthly/yearly spending, upcoming renewals, category breakdown
- **Subscription Management** — Add, edit, pause, and delete subscriptions with category tagging
- **Calendar View** — Monthly calendar showing billing dates with day-detail drill-down
- **Spending Insights** — Category breakdown, spending trends, most expensive rankings
- **Bank Linking** — Connect bank accounts via Plaid to auto-detect recurring charges
- **Smart Notifications** — Configurable renewal reminders via push and email
- **Dark Mode** — Full dark mode support from day one

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo (SDK 54) |
| Navigation | Expo Router (file-based) |
| Styling | Tailwind CSS + NativeWind v4 |
| UI Components | shadcn/ui-inspired + react-native-reusables |
| State | Zustand (client) + TanStack React Query (server) |
| Backend | Supabase (Postgres, Auth, Edge Functions, RLS) |
| Bank Linking | Plaid API |
| Notifications | Expo Notifications + Resend (email) |
| Icons | Lucide React Native |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- [Supabase account](https://supabase.com)
- [Plaid developer account](https://plaid.com) (optional, for bank linking)

### Installation

```bash
# Clone the repository
git clone https://github.com/maxcon14/billo-app.git
cd billo-app

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env
# Fill in your Supabase URL, anon key, and other service keys
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration to create the database schema:
   ```bash
   # Via Supabase CLI
   supabase db push

   # Or manually paste supabase/migrations/001_initial_schema.sql
   # into the Supabase SQL Editor
   ```
3. Enable the following auth providers in your Supabase dashboard:
   - Email/Password
   - Google OAuth (optional)
   - Apple Sign-In (optional)

4. Deploy Edge Functions:
   ```bash
   supabase functions deploy plaid-webhook
   supabase functions deploy detect-subscriptions
   supabase functions deploy send-reminders
   ```

5. Set up the daily reminder CRON job in SQL Editor:
   ```sql
   SELECT cron.schedule(
     'daily-reminders',
     '0 9 * * *',
     $$SELECT net.http_post(
       url := '<YOUR_SUPABASE_URL>/functions/v1/send-reminders',
       headers := '{"Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb
     )$$
   );
   ```

### Running the App

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Project Structure

```
├── app/                    # Expo Router file-based routes
│   ├── (auth)/             # Auth screens (login, register, onboarding)
│   ├── (tabs)/             # Main tab navigation (dashboard, subs, calendar, insights, settings)
│   ├── subscription/       # Subscription detail + add screens
│   └── plaid/              # Plaid bank linking flow
├── components/
│   ├── ui/                 # Base UI components (Button, Card, Input, etc.)
│   ├── subscription/       # Subscription-specific components
│   ├── dashboard/          # Dashboard widgets
│   ├── calendar/           # Calendar components
│   ├── insights/           # Analytics visualizations
│   └── shared/             # Shared components (Logo, PriceDisplay, EmptyState)
├── hooks/                  # React Query hooks + custom hooks
├── stores/                 # Zustand state stores
├── lib/                    # Utilities, Supabase client, constants
├── types/                  # TypeScript type definitions
└── supabase/
    ├── migrations/         # Database schema
    ├── functions/          # Edge Functions (Deno)
    └── seed.sql            # Sample data
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `EXPO_PUBLIC_PLAID_CLIENT_ID` | Plaid API client ID |
| `EXPO_PUBLIC_PLAID_ENV` | Plaid environment (sandbox/development/production) |
| `PLAID_SECRET` | Plaid API secret (server-side only) |
| `RESEND_API_KEY` | Resend API key for emails |
| `EXPO_PUBLIC_LOGO_DEV_API_KEY` | Logo.dev API key |
| `SENTRY_DSN` | Sentry error tracking DSN |
| `EXPO_PUBLIC_POSTHOG_KEY` | PostHog analytics key |

## Database Schema

The app uses 6 main tables with Row Level Security enabled:

- **profiles** — User preferences (currency, notification settings)
- **categories** — Subscription categories (9 defaults + custom)
- **subscriptions** — Core subscription data with billing info
- **plaid_items** — Linked bank accounts
- **transactions** — Transaction history for detected subscriptions
- **notifications** — In-app notification log

## License

Private — All rights reserved.
