# Supabase Setup for NoiseWindow

This project uses Supabase for database management. Follow these steps to set up the database.

## Prerequisites

Install Supabase CLI (choose one method):

### Option 1: Homebrew (macOS)
```bash
brew install supabase/tap/supabase
```

### Option 2: npm (without global install)
```bash
npx supabase --help
```

### Option 3: Direct Download
Visit: https://github.com/supabase/cli/releases

## Initial Setup

1. **Link to your Supabase project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```
   Get your project ref from: https://app.supabase.com → Your Project → Settings → General

2. **Pull existing schema (if any):**
   ```bash
   supabase db pull
   ```

## Running Migrations

### Apply migrations to remote database:
```bash
supabase db push
```

### Create a new migration:
```bash
supabase migration new migration_name
```

### Reset database (WARNING: deletes all data):
```bash
supabase db reset
```

## Local Development

### Start local Supabase:
```bash
supabase start
```

### Stop local Supabase:
```bash
supabase stop
```

## Database Schema

### Tables Created:

1. **schedules** - Stores user schedules
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to auth.users)
   - `date` (DATE)
   - `start_time` (TIME)
   - `end_time` (TIME)
   - `is_off` (BOOLEAN)
   - `is_tba` (BOOLEAN)
   - `notifications_enabled` (BOOLEAN)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **user_preferences** - Stores user settings
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to auth.users, Unique)
   - `language` (VARCHAR(10))
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Policies are automatically created with migrations

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: https://app.supabase.com → Your Project → Settings → API
