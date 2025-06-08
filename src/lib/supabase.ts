
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Question = {
  id: number
  question_text: string
  choice_a: string
  choice_b: string
  choice_c: string
  choice_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
  explanation?: string
  created_at: string
  updated_at: string
}

export type ExamResult = {
  id: number
  user_id: string
  score: number
  total_questions: number
  answers_data: Record<string, any>
  question_count: number
  created_at: string
}

export type Profile = {
  id: string
  username: string
  is_admin: boolean
  created_at: string
  updated_at: string
}
