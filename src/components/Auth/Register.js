import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Register.css';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const evaluatePasswordStrength = (password) => {
    const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    const medium = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (strong.test(password)) return 'strong';
    if (medium.test(password)) return 'medium';
    if (password.length > 0) return 'weak';
    return '';
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (name === 'password') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    if (name === 'confirmPassword') {
      setIsConfirmTouched(true);
    }

    const doMatch = updatedData.password === updatedData.confirmPassword;
    setPasswordMatch(doMatch);

    const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    const isValid =
      updatedData.name.trim() &&
      updatedData.email.trim() &&
      strongPassword.test(updatedData.password) &&
      doMatch;

    setIsFormValid(isValid);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      login(res.data.user, res.data.token);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'strong') return '#5e995eff';
    if (passwordStrength === 'medium') return '#ffd580';
    if (passwordStrength === 'weak') return '#ff7f7f';
    return '';
  };

  const passwordFieldStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const eyeIconStyle = {
    position: 'absolute',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#888'
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="title">Sign Up</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />

          {/* Password with Font Awesome eye icon */}
          <div style={passwordFieldStyle}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
              style={{ width: '100%' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              style={eyeIconStyle}
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>

          {/* Password strength */}
          {formData.password && (
            <>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: getStrengthColor(),
                marginTop: '-8px',
                marginBottom: '-12px'
              }}>
                Password strength: {passwordStrength}
              </p>

              {(passwordStrength === 'weak' || passwordStrength === 'medium') && (
                <p style={{
                  fontSize: '12px',
                  color: '#a0aec0',
                  // marginTop: '-2px',
                  marginBottom: '0px'
                }}>
                  Password should contain uppercase letters, numbers, symbols and be at least 8 characters long.
                </p>
              )}
            </>
          )}

          {/* Confirm password with Font Awesome eye icon */}
          <div style={passwordFieldStyle}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
              style={{ width: '100%' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              style={eyeIconStyle}
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
            </button>
          </div>

          {isConfirmTouched && !passwordMatch && (
            <p className="error-text">Passwords do not match</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? undefined : '#ccc',
              cursor: isFormValid ? 'pointer' : 'not-allowed'
            }}
          >
            Register
          </button>
        </form>

        <p className="login-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
