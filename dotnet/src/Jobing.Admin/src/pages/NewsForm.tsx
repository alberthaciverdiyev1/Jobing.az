import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import type { NewsItem, NewsCategory } from '../types'
import { ArrowLeft, Save } from 'lucide-react'

const LANGUAGES = [
  { key: 'az', label: 'Azərbaycanca' },
  { key: 'en', label: 'English' },
  { key: 'ru', label: 'Русский' },
]

export default function NewsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [title, setTitle] = useState<Record<string, string>>({ az: '', en: '', ru: '' })
  const [content, setContent] = useState<Record<string, string>>({ az: '', en: '', ru: '' })
  const [excerpt, setExcerpt] = useState<Record<string, string>>({ az: '', en: '', ru: '' })
  const [coverImage, setCoverImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [activeLang, setActiveLang] = useState('az')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes] = await Promise.all([
          api.get('/news-categories/all'),
        ])
        setCategories(catRes.data || [])

        if (id) {
          const postRes = await api.get<NewsItem>(`/news/${id}`)
          const p = postRes.data
          setTitle(p.title || { az: '', en: '', ru: '' })
          setContent(p.content || { az: '', en: '', ru: '' })
          setExcerpt(p.excerpt || { az: '', en: '', ru: '' })
          setCoverImage(p.coverImage || '')
          setCategoryId(p.categoryId || '')
          setIsPublished(p.isPublished)
        }
      } catch {
        setError('Məlumat yüklənə bilmədi')
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const body = {
        title,
        content: content.az ? content : null,
        excerpt: excerpt.az ? excerpt : null,
        coverImage: coverImage || null,
        categoryId: categoryId || null,
        isPublished,
      }
      if (isEdit) {
        await api.put(`/news/${id}`, body)
      } else {
        await api.post('/news', body)
      }
      navigate('/news')
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
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/news')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Xəbəri düzəlt' : 'Yeni xəbər'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Xəbər məlumatlarını yeniləyin' : 'Yeni xəbər əlavə edin'}</p>
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

      {/* Language tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {LANGUAGES.map(({ key, label }) => (
          <button key={key} type="button" onClick={() => setActiveLang(key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeLang === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>{label}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Başlıq <span className="text-gray-400">({LANGUAGES.find(l => l.key === activeLang)?.label})</span>
          </label>
          <input value={title[activeLang] || ''} onChange={e => setTitle(p => ({ ...p, [activeLang]: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kateqoriya</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="">Seçilməyib</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name?.az || cat.slug}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-gray-700">Yayımlandı</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Qısa məzmun <span className="text-gray-400">({LANGUAGES.find(l => l.key === activeLang)?.label})</span>
          </label>
          <textarea value={excerpt[activeLang] || ''} onChange={e => setExcerpt(p => ({ ...p, [activeLang]: e.target.value }))} rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Məzmun <span className="text-gray-400">({LANGUAGES.find(l => l.key === activeLang)?.label})</span>
          </label>
          <textarea value={content[activeLang] || ''} onChange={e => setContent(p => ({ ...p, [activeLang]: e.target.value }))} rows={12}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y font-mono" />
          <p className="text-xs text-gray-400 mt-1">HTML məzmun daxil edə bilərsiniz</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Şəkil URL</label>
          <input value={coverImage} onChange={e => setCoverImage(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            placeholder="https://..." />
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/news')}
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
