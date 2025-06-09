
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zbfwjiojsievpivacwno.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZndqaW9qc2lldnBpdmFjd25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjEzMTQsImV4cCI6MjA2NDkzNzMxNH0.CBGDpBpkf7aCYH3N6gqZpVqwkAiVDvmbb1_ZzNKO6yM"

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
  category_id?: number
  created_at: string
  updated_at: string
  exam_categories?: ExamCategory
}

export type ExamResult = {
  id: number
  user_id: number
  score: number
  total_questions: number
  answers_data: Record<string, any>
  question_count: number
  created_at: string
}

export type User = {
  id: number
  username: string
  password_hash: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type ExamCategory = {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}
