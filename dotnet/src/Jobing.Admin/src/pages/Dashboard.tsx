import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { MapPin, SlidersHorizontal, FileText, Users, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cities, filters, posts, users] = await Promise.all([
          api.get('/cities?pageSize=1'),
          api.get('/filters?pageSize=1'),
          api.get('/blog-posts?pageSize=1'),
          api.get('/admin/users?pageSize=1'),
        ])
        setStats({
          cities: cities.data.totalCount || 0,
          filters: filters.data.totalCount || 0,
          posts: posts.data.totalCount || 0,
          users: users.data.totalCount || 0,
        })
      } catch {
        // silently fail for stats
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const quickActions = [
    { label: 'Şəhərlər', icon: MapPin, href: '/cities', color: 'bg-blue-500' },
    { label: 'Filterlər', icon: SlidersHorizontal, href: '/filters', color: 'bg-emerald-500' },
    { label: 'Blog yazıları', icon: FileText, href: '/blog-posts', color: 'bg-violet-500' },
    { label: 'İstifadəçilər', icon: Users, href: '/users', color: 'bg-amber-500' },
  ]

  const statCards = [
    { label: 'Şəhərlər', value: stats.cities ?? '—', href: '/cities' },
    { label: 'Filterlər', value: stats.filters ?? '—', href: '/filters' },
    { label: 'Blog yazıları', value: stats.posts ?? '—', href: '/blog-posts' },
    { label: 'İstifadəçilər', value: stats.users ?? '—', href: '/users' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xoş gəldiniz, {user?.name || user?.email}
        </h1>
        <p className="text-gray-500 mt-1">Jobing.az idarə panelinə xoş gəlmisiniz</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(stat.href)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Tez giriş</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.href)}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 text-sm">{action.label}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
