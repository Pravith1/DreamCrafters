import React, { useState, useEffect } from 'react'
import { Search, Trash2, Clock, Users } from 'lucide-react'
import { adminAPI } from '../../api'
import AdminLayout from '../../components/AdminLayout'

export default function WebinarManagement() {
  const [webinars, setWebinars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    loadWebinars()
  }, [page])

  const loadWebinars = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (search) params.search = search

      const res = await adminAPI.getWebinars(params)
      if (res.data.success) {
        setWebinars(res.data.webinars)
        setTotalPages(res.data.totalPages)
        setTotal(res.data.total)
      }
    } catch (err) {
      console.error('Failed to load webinars:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadWebinars()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this webinar? All registrations will also be removed.')) return
    setDeleting(id)
    try {
      const res = await adminAPI.deleteWebinar(id)
      if (res.data.success) {
        setWebinars(prev => prev.filter(w => w.id !== id))
        setTotal(prev => prev - 1)
      }
    } catch (err) {
      console.error('Failed to delete webinar:', err)
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isUpcoming = (dateStr) => new Date(dateStr) > new Date()

  return (
    <AdminLayout title="Webinar Management">
      <div className="admin-page-header">
        <h1>Webinar Management</h1>
        <p>View and manage all scheduled webinars across the platform</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
            <input
              type="text"
              className="admin-search"
              placeholder="Search webinars by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="admin-btn activate" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} /> Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner" />
          </div>
        ) : webinars.length > 0 ? (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Host</th>
                    <th>Scheduled</th>
                    <th>Duration</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webinars.map(w => (
                    <tr key={w.id}>
                      <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>#{w.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.title}</div>
                        {w.topic && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{w.topic}</div>}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{w.host?.name || 'Unknown'}</td>
                      <td style={{ fontSize: '0.85rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{formatDateTime(w.scheduledAt)}</td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={13} /> {w.durationMinutes || '-'} min
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Users size={13} /> {w._count?.registrations || 0}{w.maxParticipants ? ` / ${w.maxParticipants}` : ''}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${isUpcoming(w.scheduledAt) ? 'active' : 'completed'}`}>
                          {isUpcoming(w.scheduledAt) ? 'Upcoming' : 'Past'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-btn delete"
                          onClick={() => handleDelete(w.id)}
                          disabled={deleting === w.id}
                        >
                          <Trash2 size={14} /> {deleting === w.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Showing {webinars.length} of {total} webinars (Page {page} of {totalPages})
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
            <h3>No webinars found</h3>
            <p>No webinars match your current search criteria</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
