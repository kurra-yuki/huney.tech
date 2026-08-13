import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!serviceRole) {
    // In server environments we expect the service role to be set for admin checks
}

export const supabaseServer = createClient(url, serviceRole, { auth: { persistSession: false } });
