import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import type { Setting } from '../types'
import { ArrowLeft, Save } from 'lucide-react'

const GROUPS = [
  { value: 'general', label: 'Ümumi' },
  { value: 'contact', label: 'Əlaqə' },
  { value: 'social', label: 'Sosial şəbəkələr' },
  { value: 'seo', label: 'SEO' },
  { value: 'analytics', label: 'Analitika' },
]

export default function SettingsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [key, setKey] = useState('')
  const [group, setGroup] = useState('general')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!id) { setFetching(false); return }
      try {
        const res = await api.get<Setting>(`/settings/${id}`)
        const s = res.data
        setKey(s.key)
        setGroup(s.group)
        setValue(s.value || '')
        setDescription(s.description || '')
        setIsActive(s.isActive)
        setSortOrder(s.sortOrder)
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
    const body = {
      key,
      group,
      value: value || null,
      description: description || null,
      isActive,
      sortOrder: Number(sortOrder) || 0,
    }
    try {
      if (isEdit) {
        await api.put(`/settings/${id}`, body)
      } else {
        await api.post('/settings', body)
      }
      navigate('/settings')
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.title || 'Xəta baş verdi')
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
        <button onClick={() => navigate('/settings')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Tənzimləməni düzəlt' : 'Yeni tənzimləmə'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Tənzimləmə məlumatlarını yeniləyin' : 'Yeni tənzimləmə əlavə edin'}</p>
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Açar (Key) <span className="text-red-500">*</span></label>
            <input value={key} onChange={e => setKey(e.target.value)} disabled={isEdit}
              placeholder="məs. contact.phone"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow disabled:bg-gray-50 disabled:text-gray-500" required />
            <p className="text-xs text-gray-400 mt-1">Aşağı hərflər, nöqtə ilə ayrılmış format: qrup.açar</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Qrup <span className="text-red-500">*</span></label>
            <select value={group} onChange={e => setGroup(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              {GROUPS.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Dəyər</label>
          <textarea value={value} onChange={e => setValue(e.target.value)} rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y font-mono" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Təsvir</label>
          <input value={description} onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sıra</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-gray-700">Aktiv</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/settings')}
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
