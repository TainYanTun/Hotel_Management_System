import { Link } from 'react-router-dom';

const Dashboard = () => {
  const recentBookings = [
    { id: '#BK-1204', guest: 'Sarah Johnson', room: '204 (Deluxe)', amount: '$450.00', status: 'Paid' },
    { id: '#BK-1205', guest: 'Michael Chen', room: '102 (Standard)', amount: '$210.00', status: 'Pending' },
    { id: '#BK-1206', guest: 'Emma Wilson', room: '405 (Suite)', amount: '$890.00', status: 'Paid' },
    { id: '#BK-1207', guest: 'James Miller', room: '301 (Deluxe)', amount: '$450.00', status: 'Paid' },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#533afd"/>
            <path d="M12 28V12H15.5V18.5H24.5V12H28V28H24.5V21.5H15.5V28H12Z" fill="white"/>
          </svg>
          <span>Hotel Hub</span>
        </div>
        
        <nav className="nav-links">
          <li className="nav-item">
            <a href="#" className="nav-link active">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Bookings
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h5m-5 4h5" />
              </svg>
              Rooms
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Guests
            </a>
          </li>
        </nav>
        
        <div className="nav-footer" style={{ borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
          <Link to="/" className="nav-link">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h2>Dashboard Overview</h2>
            <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Welcome back, Hotel Admin</p>
          </div>
          <button className="btn-primary">
            + New Booking
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">$24,500.00</p>
            <div className="stat-change change-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 15l7-7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              12% from last month
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Occupancy Rate</p>
            <p className="stat-value">84%</p>
            <div className="stat-change change-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 15l7-7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              5% from last week
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">New Bookings</p>
            <p className="stat-value">42</p>
            <div className="stat-change change-down">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              2% from yesterday
            </div>
          </div>
        </section>

        <section className="data-table-card">
          <h3>Recent Bookings</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td style={{ color: 'var(--stripe-purple)', fontWeight: 400 }}>{booking.id}</td>
                  <td>{booking.guest}</td>
                  <td>{booking.room}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{booking.amount}</td>
                  <td>
                    <span className={`status-pill ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
