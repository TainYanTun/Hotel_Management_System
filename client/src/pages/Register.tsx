import { Link } from 'react-router-dom';

const Register = () => {
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
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="John Doe" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@company.com" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary full-width" style={{ marginTop: '8px' }}>
            Get started
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
