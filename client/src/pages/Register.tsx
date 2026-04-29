import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    full_name: '', 
    role: 'RECEPTIONIST' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-header">
        <div className="auth-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#533afd"/>
            <path d="M12 28V12H15.5V18.5H24.5V12H28V28H24.5V21.5H15.5V28H12Z" fill="white"/>
          </svg>
        </div>
        <h1>Create an Account</h1>
        <p>Join the hotel management platform</p>
      </div>
      
      <div className="card">
        {error && (
          <div style={{ color: '#df1b41', background: '#fff1f2', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full name</label>
            <input 
              type="text" 
              id="full_name" 
              placeholder="John Doe" 
              required 
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="e.g. jdoe_admin" 
              required 
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select 
              id="role" 
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-default)', background: 'white' }}
            >
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="MANAGER">Manager</option>
              <option value="FINANCE">Finance</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary full-width" style={{ marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Get started'}
          </button>
        </form>
      </div>
      
      <div className="auth-footer">
        Already have an account? <Link to="/">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
