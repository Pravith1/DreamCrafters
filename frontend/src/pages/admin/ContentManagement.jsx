import React, { useState, useEffect } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { adminAPI } from '../../api'
import AdminLayout from '../../components/AdminLayout'

export default function ContentManagement() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    loadContent()
  }, [page, typeFilter])

  const loadContent = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (typeFilter) params.type = typeFilter
      if (search) params.search = search

      const res = await adminAPI.getContent(params)
      if (res.data.success) {
        setContent(res.data.content)
        setTotalPages(res.data.totalPages)
        setTotal(res.data.total)
      }
    } catch (err) {
      console.error('Failed to load content:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadContent()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await adminAPI.deleteContent(id)
      if (res.data.success) {
        setContent(prev => prev.filter(c => c.id !== id))
        setTotal(prev => prev - 1)
      }
    } catch (err) {
      console.error('Failed to delete content:', err)
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

  return (
    <AdminLayout title="Content Management">
      <div className="admin-page-header">
        <h1>Content Management</h1>
        <p>Browse and manage all content items in the resource library</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
            <input
              type="text"
              className="admin-search"
              placeholder="Search content by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="admin-btn activate" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} /> Search
            </button>
          </form>
          <select
            className="admin-filter"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Types</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="quiz">Quiz</option>
            <option value="ebook">E-Book</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner" />
          </div>
        ) : content.length > 0 ? (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Difficulty</th>
                    <th>Language</th>
                    <th>Creator</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map(c => (
                    <tr key={c.id}>
                      <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>#{c.id}</td>
                      <td style={{ fontWeight: 600, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                      <td><span className={`admin-badge ${c.type}`}>{c.type}</span></td>
                      <td><span className={`admin-badge ${c.difficulty}`}>{c.difficulty}</span></td>
                      <td style={{ fontSize: '0.85rem' }}>{c.language}</td>
                      <td style={{ fontSize: '0.85rem' }}>{c.creator?.name || 'System'}</td>
                      <td style={{ fontSize: '0.85rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                      <td>
                        <button
                          className="admin-btn delete"
                          onClick={() => handleDelete(c.id)}
                          disabled={deleting === c.id}
                        >
                          <Trash2 size={14} /> {deleting === c.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Showing {content.length} of {total} items (Page {page} of {totalPages})
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
            <h3>No content found</h3>
            <p>No content items match your current filters</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
