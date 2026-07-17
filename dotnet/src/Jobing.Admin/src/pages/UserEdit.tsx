import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import { ArrowLeft, Save } from 'lucide-react'

interface RoleInfo {
  id: string
  name: string
}

interface UserDetail {
  id: string
  email: string
  profile?: { name?: string; surname?: string }
  isActive: boolean
  roles: string[]
}

export default function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState<UserDetail | null>(null)
  const [allRoles, setAllRoles] = useState<RoleInfo[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const [userRes, rolesRes] = await Promise.all([
          api.get<UserDetail>(`/admin/users/${id}`),
          api.get<RoleInfo[]>('/admin/users/roles/all'),
        ])
        setUser(userRes.data)
        setAllRoles(rolesRes.data || [])
        setSelectedRoles(userRes.data.roles || [])
      } catch {
        setError('Məlumat yüklənə bilmədi')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName) ? prev.filter(r => r !== roleName) : [...prev, roleName]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.put(`/admin/users/${id}/roles`, { roles: selectedRoles })
      setSuccess('Rollar yeniləndi')
    } catch {
      setError('Yenilənə bilmədi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (!user) {
    return <div className="p-12 text-center"><p className="text-gray-500">İstifadəçi tapılmadı</p></div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/users')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İstifadəçi rolları</h1>
          <p className="text-gray-500 text-sm mt-1">İstifadəçi rollarını idarə edin</p>
        </div>
      </div>

      {success && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 flex items-center gap-2">
          {success} <button onClick={() => setSuccess('')} className="ml-auto font-bold">&times;</button>
        </div>
      )}
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* User info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-base font-semibold text-indigo-700">
                {user.profile?.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {user.profile?.name ? `${user.profile.name} ${user.profile.surname || ''}` : user.email}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
              {user.profile?.name && (
                <div className="text-xs text-gray-400 mt-0.5">{user.profile.name} {user.profile.surname}</div>
              )}
            </div>
            <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${
              user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>{user.isActive ? 'Aktiv' : 'Deaktiv'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Rollar</h3>
          {allRoles.length === 0 ? (
            <p className="text-sm text-gray-500">Heç bir rol tapılmadı</p>
          ) : (
            <div className="grid gap-3">
              {allRoles.map((role) => (
                <label key={role.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox" checked={selectedRoles.includes(role.name)}
                    onChange={() => toggleRole(role.name)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{role.name}</span>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <button type="button" onClick={() => navigate('/users')}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Ləğv et</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <Save className="w-4 h-4" /> {saving ? 'Saxlanılır...' : 'Yadda saxla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
