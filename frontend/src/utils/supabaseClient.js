import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gycefswmixlhsjjifcxh.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to fetch all issues with real-time subscription
 */
export const fetchIssuesFromSupabase = async () => {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

/**
 * Create a new issue
 */
export const createIssueInSupabase = async (issueData) => {
  const { data, error } = await supabase
    .from('issues')
    .insert([issueData])
    .select();
    
  if (error) throw error;
  return data[0];
};

/**
 * Handle Realtime updates for issues
 */
export const subscribeToIssues = (onUpdate) => {
  return supabase
    .channel('public:issues')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, onUpdate)
    .subscribe();
};
