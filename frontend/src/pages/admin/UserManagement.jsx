import React, { useState, useEffect } from 'react'
import { Search, UserX, UserCheck } from 'lucide-react'
import { adminAPI } from '../../api'
import AdminLayout from '../../components/AdminLayout'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [toggling, setToggling] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [page, roleFilter])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (roleFilter) params.role = roleFilter
      if (search) params.search = search

      const res = await adminAPI.getUsers(params)
      if (res.data.success) {
        setUsers(res.data.users)
        setTotalPages(res.data.totalPages)
        setTotal(res.data.total)
      }
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadUsers()
  }

  const handleToggleStatus = async (userId) => {
    setToggling(userId)
    try {
      const res = await adminAPI.toggleUserStatus(userId)
      if (res.data.success) {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, isActive: res.data.user.isActive } : u
        ))
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err)
    } finally {
      setToggling(null)
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
    <AdminLayout title="User Management">
      <div className="admin-page-header">
        <h1>User Management</h1>
        <p>View, search, and manage all registered users on the platform</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
            <input
              type="text"
              className="admin-search"
              placeholder="Search by name, email, or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="admin-btn activate" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} /> Search
            </button>
          </form>
          <select
            className="admin-filter"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="educator">Educators</option>
            <option value="mentor">Mentors</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-spinner" />
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>#{u.id}</td>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                      <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{u.username || '-'}</td>
                      <td><span className={`admin-badge ${u.role}`}>{u.role}</span></td>
                      <td>
                        <span className={`admin-badge ${u.isVerified ? 'active' : 'inactive'}`}>
                          {u.isVerified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${u.isActive ? 'active' : 'inactive'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{formatDate(u.createdAt)}</td>
                      <td>
                        {u.role !== 'admin' && (
                          <button
                            className={`admin-btn ${u.isActive ? 'deactivate' : 'activate'}`}
                            onClick={() => handleToggleStatus(u.id)}
                            disabled={toggling === u.id}
                          >
                            {u.isActive ? (
                              <><UserX size={14} /> Deactivate</>
                            ) : (
                              <><UserCheck size={14} /> Activate</>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Showing {users.length} of {total} users (Page {page} of {totalPages})
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
            <h3>No users found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
