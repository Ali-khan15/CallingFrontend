import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Signup = ({ isLoginMode }) => {
  const [isLogin, setIsLogin] = useState(isLoginMode || false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    companyName: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Check if it's login mode when navigating between routes
  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      password: '',
      companyName: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const apiUrl = isLogin ? '/login' : '/signup';
    const response = await fetch(`https://calling-backend-blond.vercel.app${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Save the user info in localStorage
      localStorage.setItem('fullName', data.user.fullName);
      localStorage.setItem('companyName', data.user.companyName);
      localStorage.setItem('id', data.user ? data.user._id : null);
      console.log('User logged in/signed up:', data);

      // Navigate to the home page
      navigate('/home');
    } else {
      console.error(data.message);
      alert(data.message); // Show an alert in case of an error
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h1>Join Us and Unlock Endless Possibilities!</h1>
        <p>
          {isLogin ? 'Log in to continue your journey' : 'Sign up now to access exclusive features and seamless experience.'}
        </p>
      </div>

      <div className={isLogin ? 'login-right' : 'signup-right'}>
        {isLogin ? (
          <>
            <h2>Log in to Calling Web</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Your Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />

              <button type="submit" className="btn-primary">Log in</button>

              <div className="social-signup">
                <p>or</p>
                <button type="button" className="btn-google">Log in with Google</button>
              </div>
            </form>

            <p className="signup-redirect">
              Don't have an account? <a href="#signup" onClick={toggleForm}>Sign up</a>
            </p>
          </>
        ) : (
          <>
            <h2>Sign up to Calling Web</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Your Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                pattern="[0-9]{11}"
                title="Please enter a valid 11-digit phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Create a Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />

              <button type="submit" className="btn-primary">Create Account</button>

              <div className="social-signup">
                <p>or</p>
                <button type="button" className="btn-google">Sign up with Google</button>
              </div>
            </form>

            <p className="login-redirect">
              Already a member? <a href="#login" onClick={toggleForm}>Log in here</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
