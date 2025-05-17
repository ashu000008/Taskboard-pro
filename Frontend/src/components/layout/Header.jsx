import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Layout.css';

function Header() {
  const { currentUser, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">TaskBoard Pro</Link>
      </div>
      
      <nav className="nav-links">
        {currentUser ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/projects">Projects</Link>
          </>
        ) : (
          <Link to="/about">About</Link>
        )}
      </nav>
      
      <div className="user-section">
        {currentUser ? (
          <div className="user-profile">
            <Link to="/profile" className="user-avatar-link">
              <img 
                src={currentUser.photoURL || '/default-avatar.png'} 
                alt="Profile" 
                className="user-avatar" 
              />
            </Link>
            <span className="user-name">{currentUser.displayName}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </header>
  );
}

export default Header;
