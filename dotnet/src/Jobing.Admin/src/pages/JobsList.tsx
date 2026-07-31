import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { Job } from '../types'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react'

export default function JobsList() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState('')
  const pageSize = 15

  useEffect(() => { fetchJobs() }, [page])

  const fetchJobs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/jobs?page=${page}&pageSize=${pageSize}`)
      setItems(res.data.items)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Məlumatlar yüklənə bilmədi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu vakansiyanı silmək istədiyinizə əminsiniz?')) return
    try {
      await api.delete(`/jobs/${id}`)
      setMessage('Silindi')
      if (items.length === 1 && page > 1) setPage(p => p - 1)
      else fetchJobs()
    } catch { setError('Silinə bilmədi') }
  }

  const displayText = (val: Record<string, string> | string | undefined | null): string => {
    if (!val) return ''
    if (typeof val === 'string') return val
    return val.az || Object.values(val)[0] || ''
  }

  const formatSalary = (j: Job): string => {
    if (j.minSalary != null || j.maxSalary != null) {
      const parts = []
      if (j.minSalary != null) parts.push(j.minSalary.toLocaleString('az'))
      if (j.maxSalary != null) parts.push(j.maxSalary.toLocaleString('az'))
      return parts.join(' – ') + (j.currency ? ` ${j.currency}` : '')
    }
    if (j.salaryText) return displayText(j.salaryText)
    return '—'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vakansiyalar</h1>
          <p className="text-gray-500 text-sm mt-1">Vakansiyaların idarəsi</p>
        </div>
        <button onClick={() => navigate('/jobs/create')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Yeni vakansiya
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 flex items-center gap-2">
          {message} <button onClick={() => setMessage('')} className="ml-auto font-bold">&times;</button>
        </div>
      )}
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Yüklənir...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center"><p className="text-gray-500">Heç bir vakansiya tapılmadı</p></div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Başlıq</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Şəhər</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Maaş</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"><Eye className="w-3.5 h-3.5 inline" /></th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Tarix</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{displayText(item.title)}</div>
                      {item.companyName && (
                        <div className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{item.companyName}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{displayText(item.cityName) || '—'}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{formatSalary(item)}</td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-center">{item.viewCount}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.isActive ? 'Aktiv' : 'Deaktiv'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-right whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('az')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/jobs/edit/${item.id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Düzəlt">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Səhifə {page} / {totalPages}</span>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
