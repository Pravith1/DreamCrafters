import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  Video,
  Handshake,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import '../pages/admin/Admin.css'

const adminNavItems = [
  {
    section: 'Management',
    items: [
      { path: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
      { path: '/admin/users', icon: <Users size={18} />, label: 'Users' },
      { path: '/admin/content', icon: <FileText size={18} />, label: 'Content' },
      { path: '/admin/webinars', icon: <Video size={18} />, label: 'Webinars' },
      { path: '/admin/mentorship', icon: <Handshake size={18} />, label: 'Mentorship' },
    ],
  },
]

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>DreamCrafters</h2>
          <span>Administration Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          {adminNavItems.map(section => (
            <div key={section.section}>
              <div className="admin-sidebar-section">
                <div className="admin-sidebar-section-title">{section.section}</div>
              </div>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">Account</div>
          </div>
          <button className="admin-sidebar-link" onClick={handleLogout}>
            <span className="icon"><LogOut size={18} /></span>
            Logout
          </button>
        </nav>

        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">{initials}</div>
          <div className="admin-sidebar-user-info">
            <div className="admin-sidebar-user-name">{user?.name || 'Administrator'}</div>
            <div className="admin-sidebar-user-role">Administrator</div>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <nav className="admin-topbar">
          <h1 className="admin-topbar-title">{title || 'Admin'}</h1>
          <div className="admin-topbar-actions">
            <span>Welcome, <strong>{user?.name || 'Admin'}</strong></span>
          </div>
        </nav>
        <div className="admin-page-content">
          {children}
        </div>
      </div>
    </div>
  )
}
