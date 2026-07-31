import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { City } from '../types'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CityList() {
  const navigate = useNavigate()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState('')
  const pageSize = 15

  useEffect(() => { fetchCities() }, [page])

  const fetchCities = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/cities?page=${page}&pageSize=${pageSize}&sortBy=sortOrder&sortDir=asc`)
      setCities(res.data.items)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Məlumatlar yüklənə bilmədi')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: number, current: boolean) => {
    try {
      const city = cities.find(c => c.id === id)
      if (!city) return
      await api.put(`/cities/${id}`, { ...city, isActive: !current })
      setMessage(current ? 'Deaktiv edildi' : 'Aktiv edildi')
      fetchCities()
    } catch { setError('Xəta baş verdi') }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Silinməsini təsdiqləyin?')) return
    try {
      await api.delete(`/cities/${id}`)
      setMessage('Silindi')
      if (cities.length === 1 && page > 1) setPage(p => p - 1)
      else fetchCities()
    } catch { setError('Silinə bilmədi') }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Şəhərlər</h1>
          <p className="text-gray-500 text-sm mt-1">Şəhərlərin idarəsi</p>
        </div>
        <button
          onClick={() => navigate('/cities/create')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni şəhər
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 flex items-center gap-2">
          {message}
          <button onClick={() => setMessage('')} className="ml-auto font-bold">&times;</button>
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Yüklənir...</p>
          </div>
        ) : cities.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Heç bir şəhər tapılmadı</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ad (AZ)</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ad (EN)</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ad (RU)</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Sıra</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{city.name?.az || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{city.name?.en || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{city.name?.ru || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">{city.sortOrder}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        city.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {city.isActive ? 'Aktiv' : 'Deaktiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/cities/edit/${city.id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Düzəlt"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleActive(city.id, city.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            city.isActive ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={city.isActive ? 'Deaktiv et' : 'Aktiv et'}
                        >
                          <span className="text-xs font-bold">{city.isActive ? '⏸' : '▶'}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(city.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Səhifə {page} / {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
