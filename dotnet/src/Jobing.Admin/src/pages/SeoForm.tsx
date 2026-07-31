import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import type { SeoSetting } from '../types'
import { ArrowLeft, Save } from 'lucide-react'

const LANGUAGES = [
  { key: 'az', label: 'Azərbaycanca' },
  { key: 'en', label: 'English' },
  { key: 'ru', label: 'Русский' },
]

function LocalizedTextarea({ label, value, onChange, rows = 3 }: {
  label: string
  value: Record<string, string>
  onChange: (v: Record<string, string>) => void
  rows?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label} <span className="text-gray-400">(3 dildə)</span></label>
      <div className="space-y-3">
        {LANGUAGES.map(({ key: lang, label: langLabel }) => (
          <div key={lang}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{langLabel}</label>
            <textarea value={value[lang] || ''} onChange={e => onChange({ ...value, [lang]: e.target.value })} rows={rows}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SeoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [pageKey, setPageKey] = useState('')
  const [title, setTitle] = useState<Record<string, string>>({ az: '', en: '', ru: '' })
  const [description, setDescription] = useState<Record<string, string>>({ az: '', en: '', ru: '' })
  const [keywords, setKeywords] = useState<Record<string, string>>({ az: '', en: '', ru: '' })
  const [ogImage, setOgImage] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!id) { setFetching(false); return }
      try {
        const res = await api.get<SeoSetting>(`/seo/id/${id}`)
        const s = res.data
        setPageKey(s.pageKey)
        setTitle(s.title || { az: '', en: '', ru: '' })
        setDescription(s.description || { az: '', en: '', ru: '' })
        setKeywords(s.keywords || { az: '', en: '', ru: '' })
        setOgImage(s.ogImage || '')
        setIsActive(s.isActive)
      } catch {
        setError('Məlumat yüklənə bilmədi')
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const getError = (err: any) => {
    const data = err.response?.data
    if (Array.isArray(data)) return data.map((d: any) => d.errorMessage || d.ErrorMessage).filter(Boolean).join('; ')
    return data?.message || data?.title || 'Xəta baş verdi'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const body = {
      pageKey,
      title: title.az ? title : null,
      description: description.az ? description : null,
      keywords: keywords.az ? keywords : null,
      ogImage: ogImage || null,
      isActive,
    }
    try {
      if (isEdit) {
        await api.put(`/seo/${id}`, body)
      } else {
        await api.post('/seo', body)
      }
      navigate('/seo')
    } catch (err: any) {
      setError(getError(err))
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
        <button onClick={() => navigate('/seo')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'SEO məlumatını düzəlt' : 'Yeni SEO məlumatı'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Səhifənin SEO meta məlumatlarını yeniləyin' : 'Səhifə üçün SEO meta məlumatları əlavə edin'}</p>
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Səhifə (PageKey) <span className="text-red-500">*</span></label>
          <input value={pageKey} onChange={e => setPageKey(e.target.value)} disabled={isEdit}
            placeholder="məs. home"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow disabled:bg-gray-50 disabled:text-gray-500" required />
          <p className="text-xs text-gray-400 mt-1">Aşağı hərflər, nöqtə ilə ayrılmış format: home, vacancy-detail</p>
        </div>

        <LocalizedTextarea label="Başlıq (Title)" value={title} onChange={setTitle} rows={2} />
        <LocalizedTextarea label="Təsvir (Description)" value={description} onChange={setDescription} rows={3} />
        <LocalizedTextarea label="Açar sözlər (Keywords)" value={keywords} onChange={setKeywords} rows={2} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">OG Şəkli (URL)</label>
          <input value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://jobing.az/Images/Static/Logo.png"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
        </div>

        <div className="flex items-center pb-2.5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-gray-700">Aktiv</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/seo')}
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
