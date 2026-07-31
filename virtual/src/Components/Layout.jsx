import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useConfirm } from '../context/ConfirmContext';
import Avatar from './Avatar';
import logo from '../assets/logo.jpeg';

export default function Layout() {
  const { profile, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    const ok = await confirm({ title: 'Log out?', message: 'You can log back in any time with your email.', confirmText: 'Log out' });
    if (ok) {
      logout();
      navigate('/');
    }
  };

  const fullName = profile?.name || '';

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <img src={logo} alt="Campus Connect" />
          Campus Connect
        </Link>

        <nav className="top-nav">
          <NavLink to="/" end className={({ isActive }) => `top-nav-link${isActive ? ' active' : ''}`}>Notices</NavLink>
          <NavLink to="/questions" className={({ isActive }) => `top-nav-link${isActive ? ' active' : ''}`}>Questions</NavLink>
          {isAdmin && (
            <>
              <NavLink to="/admin/notices" className={({ isActive }) => `top-nav-link${isActive ? ' active' : ''}`}>Manage notices</NavLink>
              <NavLink to="/admin/notices/new" className={({ isActive }) => `top-nav-link${isActive ? ' active' : ''}`}>+ New notice</NavLink>
            </>
          )}
        </nav>

        <div className="topbar-spacer" />

        <div className="topbar-actions">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme" type="button">
            {theme === 'light' ? '☾' : '☀'}
          </button>

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="avatar-chip" onClick={() => setMenuOpen((o) => !o)} type="button">
                <Avatar name={fullName || profile.email} size={28} />
                <span>{fullName || profile.email}</span>
              </button>
              {menuOpen && (
                <div className="dropdown" onMouseLeave={() => setMenuOpen(false)}>
                  <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>My profile</Link>
                  <Link to="/questions/new" className="dropdown-item" onClick={() => setMenuOpen(false)}>Ask a question</Link>
                  <Link to="/request-access" className="dropdown-item" onClick={() => setMenuOpen(false)}>Request access</Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout} type="button">Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  );
}
