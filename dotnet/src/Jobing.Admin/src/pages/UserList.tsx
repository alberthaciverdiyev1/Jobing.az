import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { User } from '../types'
import { Pencil, ChevronLeft, ChevronRight } from 'lucide-react'

interface UserWithRoles extends User {
  roles: string[]
}

export default function UserList() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState('')
  const pageSize = 15

  useEffect(() => { fetchUsers() }, [page])

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/admin/users?page=${page}&pageSize=${pageSize}`)
      setUsers(res.data.items)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Məlumatlar yüklənə bilmədi')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: number, current: boolean) => {
    if (!window.confirm(`İstifadəçini ${current ? 'deaktiv' : 'aktiv'} etmək istədiyinizə əminsiniz?`)) return
    try {
      await api.post(`/admin/users/${id}/toggle-active`)
      setMessage(current ? 'Deaktiv edildi' : 'Aktiv edildi')
      fetchUsers()
    } catch { setError('Xəta baş verdi') }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İstifadəçilər</h1>
        <p className="text-gray-500 text-sm mt-1">Bütün istifadəçilərin idarəsi</p>
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
        ) : users.length === 0 ? (
          <div className="p-12 text-center"><p className="text-gray-500">Heç bir istifadəçi tapılmadı</p></div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">İstifadəçi</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Rollar</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Qeydiyyat</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-indigo-700">
                            {user.profile?.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.profile?.name ? `${user.profile.name} ${user.profile.surname || ''}` : user.email}
                          </div>
                          {user.profile?.name && (
                            <div className="text-xs text-gray-400">{user.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(role => (
                          <span key={role} className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>{user.isActive ? 'Aktiv' : 'Deaktiv'}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-right whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('az')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/users/edit/${user.id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Rolları düzəlt">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleActive(user.id, user.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`} title={user.isActive ? 'Deaktiv et' : 'Aktiv et'}>
                          <span className="text-xs font-bold">{user.isActive ? '⏸' : '▶'}</span>
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
