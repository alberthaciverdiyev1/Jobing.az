import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import type { Job, City, Filter, SalaryCurrency } from '../types'
import { ArrowLeft, Save } from 'lucide-react'

const LANGUAGES = [
  { key: 'az', label: 'Azərbaycanca' },
  { key: 'en', label: 'English' },
  { key: 'ru', label: 'Русский' },
]

const CURRENCIES: SalaryCurrency[] = ['AZN', 'USD', 'EUR']

const emptyLang = () => ({ az: '', en: '', ru: '' })

const toLocalInput = (iso?: string): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function JobForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [title, setTitle] = useState<Record<string, string>>(emptyLang())
  const [description, setDescription] = useState<Record<string, string>>(emptyLang())
  const [requirements, setRequirements] = useState<Record<string, string>>(emptyLang())
  const [salaryText, setSalaryText] = useState<Record<string, string>>(emptyLang())
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')
  const [currency, setCurrency] = useState<SalaryCurrency | ''>('')
  const [cityId, setCityId] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [applicationMethod, setApplicationMethod] = useState('')
  const [applicationUrl, setApplicationUrl] = useState('')
  const [isRemote, setIsRemote] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [expiresAt, setExpiresAt] = useState('')

  const [cities, setCities] = useState<City[]>([])
  const [filters, setFilters] = useState<Filter[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [activeLang, setActiveLang] = useState('az')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cityRes, filterRes] = await Promise.all([
          api.get('/cities?pageSize=100&isActive=true'),
          api.get('/filters/active'),
        ])
        setCities(cityRes.data.items || [])
        setFilters(filterRes.data || [])

        if (id) {
          const jobRes = await api.get<Job>(`/jobs/${id}`)
          const j = jobRes.data
          setTitle(j.title || emptyLang())
          setDescription(j.description || emptyLang())
          setRequirements(j.requirements || emptyLang())
          setSalaryText(j.salaryText || emptyLang())
          setMinSalary(j.minSalary != null ? String(j.minSalary) : '')
          setMaxSalary(j.maxSalary != null ? String(j.maxSalary) : '')
          setCurrency(j.currency || '')
          setCityId(j.cityId || '')
          setFilterValues(j.filterValues || {})
          setApplicationMethod(j.applicationMethod || '')
          setApplicationUrl(j.applicationUrl || '')
          setIsRemote(j.isRemote)
          setIsActive(j.isActive)
          setExpiresAt(toLocalInput(j.expiresAt))
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
        description: description.az ? description : null,
        requirements: requirements.az ? requirements : null,
        minSalary: minSalary === '' ? null : Number(minSalary),
        maxSalary: maxSalary === '' ? null : Number(maxSalary),
        salaryText: salaryText.az ? salaryText : null,
        currency: currency || null,
        applicationMethod: applicationMethod || null,
        applicationUrl: applicationUrl || null,
        filterValues,
        cityId: cityId || null,
        isRemote,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      }
      if (isEdit) {
        await api.put(`/jobs/${id}`, body)
      } else {
        await api.post('/jobs', body)
      }
      navigate('/jobs')
    } catch (err: any) {
      const details = err.response?.data
      setError(details && typeof details === 'object' && !Array.isArray(details)
        ? (details.message || 'Xəta baş verdi')
        : 'Xəta baş verdi')
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
        <button onClick={() => navigate('/jobs')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Vakansiyanı düzəlt' : 'Yeni vakansiya'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? 'Vakansiya məlumatlarını yeniləyin' : 'Yeni vakansiya əlavə edin'}</p>
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
            Başlıq <span className="text-red-500">*</span> <span className="text-gray-400">({LANGUAGES.find(l => l.key === activeLang)?.label})</span>
          </label>
          <input value={title[activeLang] || ''} onChange={e => setTitle(p => ({ ...p, [activeLang]: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Təsvir <span className="text-gray-400">({LANGUAGES.find(l => l.key === activeLang)?.label})</span>
          </label>
          <textarea value={description[activeLang] || ''} onChange={e => setDescription(p => ({ ...p, [activeLang]: e.target.value }))} rows={5}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tələblər <span className="text-gray-400">({LANGUAGES.find(l => l.key === activeLang)?.label})</span>
          </label>
          <textarea value={requirements[activeLang] || ''} onChange={e => setRequirements(p => ({ ...p, [activeLang]: e.target.value }))} rows={5}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Maaş</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Minimum</label>
              <input type="number" min="0" step="0.01" value={minSalary} onChange={e => setMinSalary(e.target.value)}
                placeholder="1000" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Maksimum</label>
              <input type="number" min="0" step="0.01" value={maxSalary} onChange={e => setMaxSalary(e.target.value)}
                placeholder="2000" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Valyuta</label>
              <select value={currency} onChange={e => setCurrency(e.target.value as SalaryCurrency | '')}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                <option value="">Seçilməyib</option>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Maaş mətni <span className="text-gray-400">({LANGUAGES.find(l => l.key === activeLang)?.label})</span>
          </label>
          <input value={salaryText[activeLang] || ''} onChange={e => setSalaryText(p => ({ ...p, [activeLang]: e.target.value }))}
            placeholder="Məs: 1500 – 2500 AZN" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şəhər</label>
            <select value={cityId} onChange={e => setCityId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="">Seçilməyib</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.name?.az}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Müraciət metodu</label>
            <select value={applicationMethod} onChange={e => setApplicationMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="">Seçilməyib</option>
              <option value="email">E-poçt</option>
              <option value="url">Keçid (URL)</option>
            </select>
          </div>
        </div>

        {applicationMethod === 'url' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Müraciət URL</label>
            <input value={applicationUrl} onChange={e => setApplicationUrl(e.target.value)}
              placeholder="https://..." className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Xüsusiyyətlər</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filters.map(f => (
              <div key={f.id}>
                <label className="block text-xs text-gray-500 mb-1">{f.name?.az}</label>
                <select value={filterValues[f.key] || ''} onChange={e => {
                  const v = e.target.value
                  setFilterValues(prev => {
                    const next = { ...prev }
                    if (v) next[f.key] = v
                    else delete next[f.key]
                    return next
                  })
                }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                  <option value="">Seçilməyib</option>
                  {f.options.map(o => (
                    <option key={o.id} value={o.value}>{o.name?.az}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bitmə tarixi</label>
            <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" />
          </div>
          <div className="flex items-end gap-6 pb-2.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isRemote} onChange={e => setIsRemote(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-gray-700">Remote</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-gray-700">Aktiv</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/jobs')}
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
