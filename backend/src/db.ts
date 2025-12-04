import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in .env file')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function initDatabase() {
  try {
    // Test connection
    const { error: testError } = await supabase.from('users').select('count').limit(1)
    
    if (testError && testError.code !== 'PGRST116') {
      // PGRST116 means table doesn't exist yet, which is fine
      console.log('⚠️  Database tables may not exist yet. Please run the SQL setup in Supabase.')
      console.log('📝 Go to your Supabase project → SQL Editor and run the setup SQL')
    }
    
    console.log('✅ Connected to Supabase database')
    console.log(`📍 Supabase URL: ${supabaseUrl}`)
  } catch (error: any) {
    console.error('❌ Database initialization error:', error.message)
    throw error
  }
}