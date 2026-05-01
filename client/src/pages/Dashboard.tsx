import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

type DashboardMetrics = {
  totalRooms: number;
  availableToday: number;
  occupied: number;
  maintenance: number;
  totalGuests: number;
  activeReservations: number;
};

type RecentBooking = {
  reservation_id: number;
  guest: string;
  room: string;
  status: string;
  date: string;
};

const Dashboard = () => {
  const [data, setData] = useState<{ metrics: DashboardMetrics; recentBookings: RecentBooking[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Normalize role casing to handle legacy values
  const rawRole = user.role || "Receptionist";
  const roleMap: Record<string, string> = {
    'ADMIN': 'Administrator',
    'FINANCE': 'Finance Officer',
    'MANAGER': 'Manager',
    'RECEPTIONIST': 'Receptionist'
  };
  const role = roleMap[rawRole] || rawRole;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stats/overview");
      if (!response.ok) throw new Error("Connection Timeout");
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Service Interruption: We're having trouble connecting to our database services. Our engineers have been alerted. Please try again in a few moments.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <style>{dashboardStyles}</style>
      <div className="dashboardPage">
        {error && (
          <div className="errorBanner">
            <div className="errorContent">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
            <button className="retryBtn" onClick={fetchDashboardData}>Retry Connection</button>
          </div>
        )}
        <section className="dashboardHero">
          <div className="heroContent">
            <span className="eyebrow">Enterprise Hub</span>
            <h1>Operations Overview</h1>
            <p>
              Welcome back, <strong>{user.full_name || "Administrator"}</strong>. 
              The system is performing optimally with {data?.metrics.availableToday || 0} rooms ready for occupancy.
            </p>
          </div>
          <div className="heroVisual">
            <div className="statusIndicator">
              <div className="pulse"></div>
              <span>System Live</span>
            </div>
          </div>
        </section>

        <section className="overviewGrid">
          <div className="mainCol">
            <div className="metricsShowcase">
              <div className="featureMetric">
                <span className="eyebrow">Inventory Status</span>
                <strong>{data?.metrics.availableToday || 0}</strong>
                <p>Available Rooms Today</p>
                <div className="progressBar">
                  <div 
                    className="progressFill" 
                    style={{ width: `${(data?.metrics.availableToday || 0) / (data?.metrics.totalRooms || 1) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="subMetrics">
                <div className="miniMetric">
                  <span>In-House Guests</span>
                  <strong>{data?.metrics.occupied || 0}</strong>
                </div>
                <div className="miniMetric">
                  <span>Active Bookings</span>
                  <strong>{data?.metrics.activeReservations || 0}</strong>
                </div>
              </div>
            </div>

            <div className="bookingsPanel">
              <div className="panelHeader">
                <h2>Recent Activity</h2>
                <Link to="/reservations" className="textLink">View all reservations →</Link>
              </div>
              <div className="tableScroller">
                <table className="dashboardTable">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Status</th>
                      <th>Booked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={4} className="emptyState">Loading activity...</td></tr>
                    ) : data?.recentBookings.length === 0 ? (
                      <tr><td colSpan={4} className="emptyState">No recent activity found.</td></tr>
                    ) : (
                      data?.recentBookings.map((booking) => (
                        <tr key={booking.reservation_id}>
                          <td><strong>{booking.guest}</strong></td>
                          <td>Room {booking.room}</td>
                          <td>
                            <span className={`statusPill ${booking.status.toLowerCase()}`}>
                              {booking.status.replace("_", " ")}
                            </span>
                          </td>
                          <td>{formatDate(booking.date)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="sideCol">
            <div className="quickActionsCard">
              <h3>Direct Access</h3>
              <div className="actionButtons">
                {role !== 'Manager' && (
                  <Link to="/reservations" className="actionBtn">
                    <span>Book Reservation</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                  </Link>
                )}
                {role !== 'Manager' && (
                  <Link to="/guests" className="actionBtn">
                    <span>Register Guest</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                  </Link>
                )}
                {role === 'Administrator' && (
                  <Link to="/rooms" className="actionBtn">
                    <span>Adjust Rates</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                  </Link>
                )}
              </div>
            </div>

            <div className="healthCard">
              <div className="healthHeader">
                <h3>Hardware & Assets</h3>
                <span className="statusOk">Active</span>
              </div>
              <div className="healthStat">
                <span>Rooms in Maintenance</span>
                <strong>{data?.metrics.maintenance || 0}</strong>
              </div>
              <div className="healthStat">
                <span>Total Inventory Capacity</span>
                <strong>{data?.metrics.totalRooms || 0}</strong>
              </div>
              <div className="healthFooter">
                <p>All assets are being monitored in real-time.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const dashboardStyles = `
  .dashboardPage {
    max-width: 1200px;
    margin: 0 auto;
    font-family: var(--font-sans);
    font-feature-settings: "ss01";
    color: #475569;
  }

  .dashboardHero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid #e2e8f0;
  }

  .heroContent h1 {
    margin: 8px 0 16px;
    color: #0f172a;
    font-size: 56px;
    font-weight: 300;
    letter-spacing: -1.5px;
    line-height: 1;
  }

  .heroContent p {
    font-size: 18px;
    font-weight: 300;
    line-height: 1.5;
    max-width: 600px;
  }

  .eyebrow {
    color: #533afd;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .statusIndicator {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 100px;
    font-size: 13px;
    color: #0f172a;
  }

  .pulse {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }

  .overviewGrid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
  }

  .mainCol { display: flex; flex-direction: column; gap: 32px; }

  .metricsShowcase {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .featureMetric {
    background: #1c1e54;
    padding: 24px;
    border-radius: 8px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .featureMetric .eyebrow { color: rgba(255,255,255,0.6); }
  .featureMetric strong { font-size: 48px; font-weight: 300; margin: 8px 0; display: block; line-height: 1; }
  .featureMetric p { margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; font-weight: 300; }

  .progressBar {
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 100px;
    margin-top: 20px;
    overflow: hidden;
  }

  .progressFill {
    height: 100%;
    background: #533afd;
    border-radius: 100px;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .subMetrics {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
  }

  .miniMetric {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 16px 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .miniMetric span { font-size: 13px; color: #64748d; margin-bottom: 4px; }
  .miniMetric strong { font-size: 24px; font-weight: 400; color: #0f172a; }

  .bookingsPanel {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  }

  .panelHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .panelHeader h2 { margin: 0; font-size: 18px; font-weight: 400; color: #0f172a; }
  .textLink { font-size: 13px; color: #533afd; text-decoration: none; font-weight: 500; }

  .dashboardTable { width: 100%; border-collapse: collapse; }
  .dashboardTable th { text-align: left; padding: 10px; border-bottom: 1px solid #f1f5f9; color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
  .dashboardTable td { padding: 12px 10px; border-bottom: 1px solid #f8fafc; font-size: 14px; color: #334155; }

  .statusPill {
    padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 500; text-transform: uppercase;
  }
  .statusPill.pending { background: #fffbeb; color: #92400e; }
  .statusPill.checked_in { background: #ecfdf5; color: #065f46; }
  .statusPill.checked_out { background: #f1f5f9; color: #475569; }

  .sideCol { display: flex; flex-direction: column; gap: 24px; }

  .quickActionsCard {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  }

  .quickActionsCard h3 { margin: 0 0 16px; font-size: 15px; font-weight: 500; color: #0f172a; }

  .actionButtons { display: flex; flex-direction: column; gap: 6px; }
  .actionBtn {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0;
    border-radius: 8px; text-decoration: none; color: #475569; font-size: 14px;
    transition: all 0.2s;
  }
  .actionBtn:hover { background: #533afd; color: white; border-color: #533afd; transform: translateX(4px); }

  .healthCard {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 24px;
    border-radius: 12px;
  }

  .healthHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .healthHeader h3 { margin: 0; font-size: 14px; font-weight: 600; color: #0f172a; }
  .statusOk { color: #10b981; font-size: 12px; font-weight: 600; text-transform: uppercase; }

  .healthStat { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .healthStat span { font-size: 13px; color: #64748d; }
  .healthStat strong { font-size: 16px; color: #0f172a; }

  .healthFooter { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
  .healthFooter p { margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.4; }

  @media (max-width: 1024px) {
    .overviewGrid { grid-template-columns: 1fr; }
    .heroContent h1 { font-size: 40px; }
  }

  @media (max-width: 768px) {
    .metricsShowcase { grid-template-columns: 1fr; }
  }

  .errorBanner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #991b1b;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  }

  .errorContent {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .retryBtn {
    background: #991b1b;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .retryBtn:hover {
    background: #7f1d1d;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default Dashboard;
