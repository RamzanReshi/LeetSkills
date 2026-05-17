# Supabase Auth Setup

This app uses Supabase Auth plus a `leetskill.profiles` table for user profile data.

1. Create a Supabase project.
2. Add these variables to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run `supabase/migrations/leetskilldb_schema.sql` in the Supabase SQL editor.
4. In Supabase API settings, expose the `leetskill` schema so client queries can access `leetskill.profiles`.
5. In Supabase Auth URL settings, add the local and production callback URLs:

```text
http://localhost:3000/auth/callback
http://localhost:3000/reset-password
https://your-domain.com/auth/callback
https://your-domain.com/reset-password
```

Protected app routes redirect signed-out users to `/login`. Auth pages redirect signed-in users to `/dashboard`.
