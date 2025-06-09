
import { useState, useEffect } from 'react'
import { supabase, ExamCategory } from '@/lib/supabase'

export const useCategories = () => {
  const [categories, setCategories] = useState<ExamCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('exam_categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (category: Omit<ExamCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('exam_categories')
        .insert(category)
        .select()
        .single()

      if (error) throw error
      setCategories(prev => [...prev, data])
      return data
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    addCategory,
    refetch: fetchCategories
  }
}
