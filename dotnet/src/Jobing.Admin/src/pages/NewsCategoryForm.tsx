import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import type { NewsCategory } from '../types'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewsCategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      api.get<NewsCategory>(`/news-categories/${id}`)
        .then(res => {
          setName(res.data.name)
          setSortOrder(res.data.sortOrder)
          setIsActive(res.data.isActive)
        })
        .catch(() => setError('Məlumat yüklənə bilmədi'))
        .finally(() => setFetching(false))
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isEdit) {
        await api.put(`/news-categories/${id}`, { name, sortOrder, isActive })
      } else {
        await api.post('/news-categories', { name, sortOrder })
      }
      navigate('/news-categories')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/news-categories')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Kateqoriyanı düzəlt' : 'Yeni kateqoriya'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Kateqoriya məlumatlarını yeniləyin' : 'Yeni xəbər kateqoriyası əlavə edin'}</p>
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sıra nömrəsi</label>
          <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))}
            className="w-32 px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
        </div>
        {isEdit && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-gray-700">Aktiv</span>
          </label>
        )}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/news-categories')}
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Ləğv et</button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Save className="w-4 h-4" /> {loading ? 'Saxlanılır...' : 'Yadda saxla'}
          </button>
        </div>
      </form>
    </div>
  )
}
