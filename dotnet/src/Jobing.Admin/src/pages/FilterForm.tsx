import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import type { Filter, FilterOption } from '../types'
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react'

const LANGUAGES: { key: string; label: string }[] = [
  { key: 'az', label: 'Azərbaycanca' },
  { key: 'en', label: 'English' },
  { key: 'ru', label: 'Русский' },
]

export default function FilterForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [name, setName] = useState<Record<string, string>>({ az: '', en: '', ru: '' })
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [options, setOptions] = useState<FilterOption[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // New option form
  const [newOptName, setNewOptName] = useState<Record<string, string>>({ az: '', en: '', ru: '' })
  const [newOptSort, setNewOptSort] = useState(0)

  useEffect(() => {
    if (id) {
      api.get<Filter>(`/filters/${id}`)
        .then(res => {
          setName(res.data.name || { az: '', en: '', ru: '' })
          setSortOrder(res.data.sortOrder)
          setIsActive(res.data.isActive)
          setOptions(res.data.options || [])
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
        await api.put(`/filters/${id}`, { name, sortOrder, isActive })
      } else {
        await api.post('/filters', { name, sortOrder })
      }
      navigate('/filters')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  const addOption = async () => {
    if (!newOptName.az.trim()) return
    if (!id) {
      // In create mode, just add to local state
      setOptions(prev => [...prev, {
        id: -Date.now(),
        filterId: 0,
        value: newOptName.az.trim().toLowerCase().replace(/\s+/g, '_'),
        name: { ...newOptName },
        sortOrder: newOptSort,
        isActive: true,
      }])
      setNewOptName({ az: '', en: '', ru: '' })
      setNewOptSort(0)
      return
    }
    try {
      const res = await api.post(`/filters/${id}/options`, { name: newOptName, sortOrder: newOptSort })
      setOptions(prev => [...prev, res.data])
      setNewOptName({ az: '', en: '', ru: '' })
      setNewOptSort(0)
      setSuccessMsg('Seçim əlavə edildi')
    } catch { setError('Seçim əlavə edilə bilmədi') }
  }

  const deleteOption = async (optId: number) => {
    if (!window.confirm('Bu seçimi silmək istədiyinizə əminsiniz?')) return
    if (optId < 0) {
      setOptions(prev => prev.filter(o => o.id !== optId))
      return
    }
    try {
      await api.delete(`/filters/options/${optId}`)
      setOptions(prev => prev.filter(o => o.id !== optId))
      setSuccessMsg('Seçim silindi')
    } catch { setError('Silinə bilmədi') }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/filters')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Filteri düzəlt' : 'Yeni filter'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Filter məlumatlarını yeniləyin' : 'Yeni filter əlavə edin'}</p>
        </div>
      </div>

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 flex items-center gap-2">
          {successMsg}
          <button onClick={() => setSuccessMsg('')} className="ml-auto font-bold">&times;</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Filter məlumatları</h2>
        {LANGUAGES.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad <span className="text-gray-400">({label})</span></label>
            <input value={name[key] || ''} onChange={e => setName(p => ({ ...p, [key]: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" required />
          </div>
        ))}
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

        {/* Options */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Seçimlər</h3>

          {options.length > 0 && (
            <div className="space-y-2 mb-4">
              {options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-900 font-medium">{opt.name?.az || '—'}</span>
                    <span className="text-gray-500">{opt.name?.en || '—'}</span>
                    <span className="text-gray-500">{opt.name?.ru || '—'}</span>
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{opt.sortOrder}</span>
                  <button type="button" onClick={() => deleteOption(opt.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new option */}
          <div className="p-4 rounded-lg border border-dashed border-gray-200 space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Yeni seçim əlavə et</p>
            <div className="grid grid-cols-3 gap-3">
              {LANGUAGES.map(({ key, label }) => (
                <input key={key} placeholder={label} value={newOptName[key] || ''}
                  onChange={e => setNewOptName(p => ({ ...p, [key]: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input type="number" placeholder="Sıra" value={newOptSort} onChange={e => setNewOptSort(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <button type="button" onClick={addOption}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Əlavə et
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/filters')}
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
