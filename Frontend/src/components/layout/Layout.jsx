import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logOut } = useAuth();

  const handleAvatarClick = () => {
    navigate('/profile'); // Navigate to the User Profile page
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/login'); // Redirect to login page after signing out
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo-link"> {/* Wrap TaskBoard Pro with Link */}
            <h2>TaskBoard Pro</h2>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>
            Projects
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <header className="top-nav">
          <div className="nav-actions">
            <button
              className="sign-out-btn"
              onClick={handleSignOut}
              title="Sign Out"
            >
              Sign Out
            </button>
            <div
              className="user-avatar"
              onClick={handleAvatarClick}
              title="Go to Profile"
            >
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;