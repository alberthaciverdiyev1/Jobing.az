import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import type { BlogPost, BlogCategory } from '../types'
import { ArrowLeft, Save } from 'lucide-react'

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes] = await Promise.all([
          api.get('/blog-categories/all'),
        ])
        setCategories(catRes.data || [])

        if (id) {
          const postRes = await api.get<BlogPost>(`/blog-posts/${id}`)
          const p = postRes.data
          setTitle(p.title)
          setContent(p.content || '')
          setExcerpt(p.excerpt || '')
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
        content: content || null,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        categoryId: categoryId || null,
        relatedPostIds: [] as string[],
        isPublished,
      }
      if (isEdit) {
        await api.put(`/blog-posts/${id}`, body)
      } else {
        await api.post('/blog-posts', body)
      }
      navigate('/blog-posts')
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
        <button onClick={() => navigate('/blog-posts')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Yazını düzəlt' : 'Yeni blog yazısı'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Yazı məlumatlarını yeniləyin' : 'Yeni blog yazısı əlavə edin'}</p>
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlıq</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kateqoriya</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="">Seçilməyib</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Qısa məzmun</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Məzmun</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={12}
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
          <button type="button" onClick={() => navigate('/blog-posts')}
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
