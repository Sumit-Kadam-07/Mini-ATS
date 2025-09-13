import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Since we're not using auth in this demo
  },
})

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('candidates').select('count', { count: 'exact' })
    if (error) throw error
    return { success: true, count: data }
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return { success: false, error }
  }
}