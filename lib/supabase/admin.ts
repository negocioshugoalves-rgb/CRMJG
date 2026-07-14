import { createClient } from '@supabase/supabase-js'
import { getSupabaseEnv } from '@/lib/env'

export function createAdminClient() {
  const { supabaseUrl } = getSupabaseEnv()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('Configure SUPABASE_SERVICE_ROLE_KEY para cadastrar usuários pelo CRM.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

