
import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://bwfmcvvkcfdccpjwjqvj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aRaJSQ5_xMMIDo8StWrB0A_la4LaAGt';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);