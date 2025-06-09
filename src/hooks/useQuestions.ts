
import { useState, useEffect } from 'react'
import { supabase, Question } from '@/lib/supabase'

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          exam_categories (
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuestions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = async (question: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'exam_categories'>) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .select(`
          *,
          exam_categories (
            id,
            name,
            description
          )
        `)
        .single()

      if (error) throw error
      setQuestions(prev => [data, ...prev])
      return data
    } catch (err) {
      throw err
    }
  }

  const deleteQuestion = async (id: number) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)

      if (error) throw error
      setQuestions(prev => prev.filter(q => q.id !== id))
    } catch (err) {
      throw err
    }
  }

  const addBulkQuestions = async (questionsData: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'exam_categories'>[]) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(questionsData)
        .select(`
          *,
          exam_categories (
            id,
            name,
            description
          )
        `)

      if (error) throw error
      setQuestions(prev => [...(data || []), ...prev])
      return data
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return {
    questions,
    loading,
    error,
    addQuestion,
    deleteQuestion,
    addBulkQuestions,
    refetch: fetchQuestions
  }
}
