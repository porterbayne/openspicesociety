import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#app'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey,
    {
      auth: {
        persistSession: true,
      },
    }
  )

  return { supabase }
}

export const getSupabaseEnvironment = () => {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
