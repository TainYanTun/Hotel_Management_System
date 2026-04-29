import React from 'react';
import Layout from '../components/Layout';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    { label: 'Total Rooms', value: '45', icon: '🏨' },
    { label: 'Available Today', value: '12', icon: '✅' },
    { label: 'Occupied', value: '30', icon: '👤' },
    { label: 'Under Maintenance', value: '3', icon: '🛠️' },
  ];

  const recentBookings = [
    { id: 1, guest: 'John Doe', room: '101', status: 'Checked In', date: 'Oct 24, 2024' },
    { id: 2, guest: 'Jane Smith', room: '204', status: 'Pending', date: 'Oct 25, 2024' },
    { id: 3, guest: 'Mike Johnson', room: '305', status: 'Checked Out', date: 'Oct 23, 2024' },
  ];

  return (
    <Layout>
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {user.full_name || 'Admin'}</h1>
          <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Here's what's happening at your hotel today.</p>
        </div>
        <div className="user-profile-summary">
          <div className="avatar">{user.username?.charAt(0).toUpperCase() || 'A'}</div>
          <div className="user-info">
            <span className="user-name">{user.full_name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-details">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-sections">
        <div className="data-table-card">
          <div className="card-header">
            <h3>Recent Bookings</h3>
            <button className="btn-ghost">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.guest}</td>
                  <td>{booking.room}</td>
                  <td>
                    <span className={`status-pill ${booking.status.toLowerCase().replace(' ', '-')}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
