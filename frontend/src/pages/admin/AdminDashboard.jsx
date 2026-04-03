import React, { useState, useEffect } from 'react'
import {
  Users,
  UserCheck,
  Video,
  Calendar,
  FileText,
  Handshake,
} from 'lucide-react'
import { adminAPI } from '../../api'
import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await adminAPI.getStats()
      if (res.data.success) {
        setStats(res.data.stats)
        setRecentUsers(res.data.recentUsers)
      }
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="admin-loading">
          <div className="admin-loading-spinner" />
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    { icon: <Users size={24} />, label: 'Total Students', value: stats?.totalStudents || 0, color: 'blue' },
    { icon: <UserCheck size={24} />, label: 'Total Educators', value: stats?.totalEducators || 0, color: 'green' },
    { icon: <Video size={24} />, label: 'Total Webinars', value: stats?.totalWebinars || 0, color: 'purple' },
    { icon: <Calendar size={24} />, label: 'Study Plans', value: stats?.totalStudyPlans || 0, color: 'orange' },
    { icon: <FileText size={24} />, label: 'Content Items', value: stats?.totalContent || 0, color: 'teal' },
    { icon: <Handshake size={24} />, label: 'Mentor Sessions', value: stats?.totalMentorSessions || 0, color: 'red' },
  ]

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform activity and statistics</p>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((s, i) => (
          <div className="admin-stat-card" key={i}>
            <div className={`admin-stat-icon ${s.color}`}>{s.icon}</div>
            <div className="admin-stat-info">
              <h3>{s.label}</h3>
              <div className="admin-stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-recent-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <Users size={18} />
              Recent Registrations
            </div>
          </div>
          {recentUsers.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{u.email}</div>
                      </td>
                      <td><span className={`admin-badge ${u.role}`}>{u.role}</span></td>
                      <td><span className={`admin-badge ${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty">
              <p>No users registered yet</p>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <FileText size={18} />
              Platform Summary
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fc', borderRadius: '8px' }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Users</span>
              <strong>{(stats?.totalStudents || 0) + (stats?.totalEducators || 0)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fc', borderRadius: '8px' }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Active Webinars</span>
              <strong>{stats?.totalWebinars || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fc', borderRadius: '8px' }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Content Library</span>
              <strong>{stats?.totalContent || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fc', borderRadius: '8px' }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Active Study Plans</span>
              <strong>{stats?.totalStudyPlans || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fc', borderRadius: '8px' }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Mentorship Sessions</span>
              <strong>{stats?.totalMentorSessions || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
