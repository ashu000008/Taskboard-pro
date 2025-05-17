import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google'; // ✅ Import MUI icon
import './Auth.css';

function Login() {
  const { signInWithGoogle, currentUser, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to TaskBoard Pro</h2>
        <p>Collaborative project management platform</p>

        {error && <p className="auth-error">{error}</p>}

        <button onClick={handleGoogleSignIn} className="google-signin-btn">
          <GoogleIcon className="google-icon" /> {/* ✅ Replaced image */}
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
