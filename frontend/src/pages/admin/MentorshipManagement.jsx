import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { adminAPI } from '../../api'
import AdminLayout from '../../components/AdminLayout'

export default function MentorshipManagement() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadSessions()
  }, [page, statusFilter])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      if (search) params.search = search

      const res = await adminAPI.getMentorships(params)
      if (res.data.success) {
        setSessions(res.data.sessions)
        setTotalPages(res.data.totalPages)
        setTotal(res.data.total)
      }
    } catch (err) {
      console.error('Failed to load mentor sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadSessions()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Not scheduled'
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AdminLayout title="Mentorship Management">
      <div className="admin-page-header">
        <h1>Mentorship Management</h1>
        <p>Monitor all mentor-student session requests and their statuses</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
            <input
              type="text"
              className="admin-search"
              placeholder="Search by mentor, student, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="admin-btn activate" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} /> Search
            </button>
          </form>
          <select
            className="admin-filter"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner" />
          </div>
        ) : sessions.length > 0 ? (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mentor</th>
                    <th>Student</th>
                    <th>Topic</th>
                    <th>Scheduled</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s.id}>
                      <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>#{s.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.mentor?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.mentor?.email || ''}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.student?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.student?.email || ''}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.topic || 'General'}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                        {formatDateTime(s.scheduledAt)}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {s.durationMinutes} min
                      </td>
                      <td>
                        <span className={`admin-badge ${s.status}`}>{s.status}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                        {formatDate(s.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Showing {sessions.length} of {total} sessions (Page {page} of {totalPages})
              </div>
              <div className="admin-pagination-buttons">
                <button
                  className="admin-pagination-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <button
                  className="admin-pagination-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="admin-empty">
            <h3>No mentor sessions found</h3>
            <p>No mentorship sessions match your current filters</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
