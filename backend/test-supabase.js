import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing')
console.log('')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('📡 Connecting to Supabase...')
    
    // Test connection by checking users table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Tables not created yet!')
        console.log('📝 Please run the SQL from SUPABASE_SETUP.sql in your Supabase SQL Editor')
        console.log('   Go to: https://supabase.com/dashboard/project/wjiokcowakfsnwsohkrt/sql')
      } else {
        console.error('❌ Error:', error.message)
      }
      return
    }
    
    console.log('✅ Successfully connected to Supabase!')
    console.log('✅ Tables are set up correctly!')
    console.log('\n🎉 You can now run: npm run dev')
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
}

testConnection()
