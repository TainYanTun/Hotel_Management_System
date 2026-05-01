import { useState, useEffect, useMemo, type CSSProperties } from "react";
import Layout from "../../components/Layout";


interface Reservation {
  reservation_id: number;
  guest_name: string;
  room_number: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  booking_date: string;
  status: string;
  price_per_night: number | string;
}

interface Room {
  room_id: number;
  status: string;
}

const formatMoney = (amount: number | string) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatDate = (date: string) => {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getNights = (checkIn: string, checkOut: string) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

const pageStyles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  hero: {
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 12% 18%, rgba(249,107,238,0.26) 0, transparent 28%), radial-gradient(circle at 90% 8%, rgba(83,58,253,0.34) 0, transparent 30%), linear-gradient(135deg, #0d253d 0%, #1c1e54 52%, #2e2b8c 100%)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "8px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 360px",
    gap: "32px",
    padding: "34px",
    boxShadow:
      "rgba(3,3,39,0.25) 0px 24px 55px -18px, rgba(0,0,0,0.16) 0px 18px 36px -18px",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  eyebrow: {
    alignItems: "center",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "4px",
    color: "rgba(255,255,255,0.86)",
    display: "inline-flex",
    fontSize: "12px",
    fontWeight: 400,
    gap: "8px",
    letterSpacing: "0.06em",
    marginBottom: "18px",
    padding: "7px 10px",
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: "44px",
    fontWeight: 300,
    letterSpacing: "-0.88px",
    lineHeight: 1.02,
    maxWidth: "650px",
    marginBottom: "14px",
  },
  intro: {
    color: "rgba(255,255,255,0.72)",
    fontSize: "16px",
    fontWeight: 300,
    lineHeight: 1.45,
    maxWidth: "600px",
    margin: 0,
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "24px",
  },
  heroPrimaryButton: {
    background: "#ffffff",
    border: "none",
    borderRadius: "4px",
    color: "var(--brand-dark)",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 400,
    padding: "10px 16px",
  },
  heroSecondaryButton: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "4px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 400,
    padding: "10px 16px",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "14px",
    gridColumn: "1 / -1",
    marginTop: "2px",
    position: "relative",
    zIndex: 1,
  },
  heroMetricCard: {
    background: "rgba(255,255,255,0.94)",
    border: "1px solid rgba(255,255,255,0.65)",
    borderRadius: "6px",
    padding: "18px",
    boxShadow:
      "rgba(3,3,39,0.18) 0px 18px 32px -20px, rgba(255,255,255,0.08) 0px 1px 0px inset",
  },
  heroPreview: {
    alignSelf: "stretch",
    background: "rgba(255,255,255,0.94)",
    border: "1px solid rgba(255,255,255,0.7)",
    borderRadius: "8px",
    boxShadow:
      "rgba(3,3,39,0.26) 0px 28px 48px -24px, rgba(0,0,0,0.12) 0px 14px 24px -18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "260px",
    padding: "20px",
    position: "relative",
    zIndex: 1,
  },
  previewHeader: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
  },
  previewBadge: {
    background: "rgba(21,190,83,0.12)",
    border: "1px solid rgba(21,190,83,0.35)",
    borderRadius: "4px",
    color: "var(--color-success-text)",
    fontSize: "11px",
    padding: "4px 7px",
  },
  previewValue: {
    color: "var(--color-heading)",
    fontFeatureSettings: '"tnum"',
    fontSize: "38px",
    fontWeight: 300,
    letterSpacing: "-0.76px",
    marginTop: "18px",
  },
  previewChart: {
    alignItems: "end",
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "8px",
    height: "92px",
    marginTop: "18px",
  },
  previewBar: {
    background: "linear-gradient(180deg, var(--magenta) 0%, var(--stripe-purple) 100%)",
    borderRadius: "4px 4px 1px 1px",
  },
  card: {
    background: "var(--pure-white)",
    border: "1px solid var(--border-default)",
    borderRadius: "6px",
    padding: "22px",
    boxShadow:
      "rgba(50,50,93,0.1) 0px 20px 40px -20px, rgba(0,0,0,0.05) 0px 10px 20px -10px",
  },
  metricValue: {
    color: "var(--color-heading)",
    fontFeatureSettings: '"tnum"',
    fontSize: "28px",
    fontWeight: 300,
    letterSpacing: "-0.3px",
    margin: "10px 0 6px",
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(340px, 0.9fr)",
    gap: "24px",
  },
  panelTitle: {
    color: "var(--color-heading)",
    fontSize: "22px",
    fontWeight: 300,
    letterSpacing: "-0.22px",
    margin: 0,
  },
  panelCopy: {
    color: "var(--color-body)",
    fontSize: "14px",
    margin: "8px 0 0",
  },
  chart: {
    alignItems: "end",
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "12px",
    height: "230px",
    marginTop: "28px",
    paddingTop: "18px",
    borderTop: "1px solid var(--border-default)",
  },
  barWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "end",
    gap: "10px",
    minWidth: 0,
  },
  bar: {
    background: "linear-gradient(180deg, var(--magenta) 0%, var(--stripe-purple) 100%)",
    borderRadius: "4px 4px 1px 1px",
    boxShadow: "rgba(83,58,253,0.28) 0px 16px 28px -16px",
  },
  generatorCard: {
    background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
    border: "1px solid var(--border-default)",
    borderRadius: "6px",
    padding: "24px",
    boxShadow:
      "rgba(50,50,93,0.1) 0px 20px 40px -20px, rgba(0,0,0,0.05) 0px 10px 20px -10px",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "22px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fieldLabel: {
    color: "var(--color-label)",
    fontSize: "12px",
    fontWeight: 400,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  fieldBox: {
    background: "var(--pure-white)",
    border: "1px solid var(--border-default)",
    borderRadius: "4px",
    color: "var(--color-heading)",
    fontSize: "14px",
    padding: "11px 12px",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  progressTrack: {
    background: "#f6f9fc",
    border: "1px solid var(--border-default)",
    borderRadius: "4px",
    height: "10px",
    overflow: "hidden",
  },
  tableWrap: {
    overflowX: "auto",
  },
  bookingTableCard: {
    background: "var(--pure-white)",
    border: "1px solid var(--border-default)",
    borderRadius: "6px",
    padding: "26px",
    boxShadow:
      "rgba(50,50,93,0.1) 0px 20px 40px -20px, rgba(0,0,0,0.05) 0px 10px 20px -10px",
  },
} satisfies Record<string, CSSProperties>;

const Reports = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, roomsRes] = await Promise.all([
          fetch("/api/reservations"),
          fetch("/api/rooms"),
        ]);
        const resData = await resRes.json();
        const roomsData = await roomsRes.json();
        setReservations(resData);
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const derivedMetrics = useMemo(() => {
    const totalRooms = rooms.length || 1;
    const occupied = rooms.filter((r) => r.status === "OCCUPIED").length;
    const reserved = rooms.filter((r) => r.status === "RESERVED").length;
    const available = rooms.filter((r) => r.status === "AVAILABLE").length;
    const maintenance = rooms.filter((r) => r.status === "MAINTENANCE").length;

    const realized = reservations.filter(r => r.status === "CHECKED_IN" || r.status === "CHECKED_OUT");
    const projected = reservations.filter(r => r.status === "PENDING" || r.status === "CONFIRMED");

    const sumRevenue = (list: Reservation[]) => list.reduce((acc, r) => {
      const price = typeof r.price_per_night === "string" ? parseFloat(r.price_per_night) : r.price_per_night;
      return acc + (price * getNights(r.check_in_date, r.check_out_date));
    }, 0);

    const realizedRevenue = sumRevenue(realized);
    const projectedRevenue = sumRevenue(projected);

    const occupancyRate = Math.round((occupied / totalRooms) * 100);

    const funnel = [
      { label: "Pending", value: reservations.filter(r => r.status === "PENDING").length, color: "#ffd7ef" },
      { label: "Confirmed", value: reservations.filter(r => r.status === "CONFIRMED").length, color: "#d6d9fc" },
      { label: "Checked in", value: reservations.filter(r => r.status === "CHECKED_IN").length, color: "#b9b9f9" },
      { label: "Checked out", value: reservations.filter(r => r.status === "CHECKED_OUT").length, color: "rgba(21, 190, 83, 0.28)" },
      { label: "No show", value: reservations.filter(r => r.status === "NO_SHOW").length, color: "#cbd5e1" },
    ];

    const maxFunnel = Math.max(...funnel.map(f => f.value), 1);

    return {
      totalRevenue: realizedRevenue + projectedRevenue,
      realizedRevenue,
      projectedRevenue,
      occupancyRate,
      roomSegments: [
        { label: "Occupied", value: `${occupied} rooms`, width: `${(occupied / totalRooms) * 100}%`, color: "var(--stripe-purple)" },
        { label: "Reserved", value: `${reserved} rooms`, width: `${(reserved / totalRooms) * 100}%`, color: "#665efd" },
        { label: "Available", value: `${available} rooms`, width: `${(available / totalRooms) * 100}%`, color: "var(--color-success)" },
        { label: "Maintenance", value: `${maintenance} rooms`, width: `${(maintenance / totalRooms) * 100}%`, color: "var(--ruby)" },
      ],
      funnel: funnel.map(f => ({ ...f, width: `${(f.value / maxFunnel) * 100}%` })),
      recentBookings: reservations.slice(0, 5)
    };
  }, [reservations, rooms]);

  if (isLoading) return <Layout><div style={{ padding: '48px', textAlign: 'center' }}>Loading intelligence data...</div></Layout>;

  return (
    <Layout>
      <div style={pageStyles.page}>
        <section style={pageStyles.hero}>
          <div style={pageStyles.heroContent}>
            <div style={pageStyles.eyebrow}>Live hotel intelligence</div>
            <h1 style={pageStyles.title}>Turn daily bookings into clear management decisions.</h1>
            <p style={pageStyles.intro}>
              Review revenue, occupancy, and guest activity in one polished workspace built for fast reporting.
            </p>
            <div style={pageStyles.heroActions}>
              <button style={pageStyles.heroPrimaryButton}>Generate April report</button>
              <button style={pageStyles.heroSecondaryButton}>View forecast</button>
            </div>
          </div>

          <aside style={pageStyles.heroPreview}>
            <div>
              <div style={pageStyles.previewHeader}>
                <div>
                  <div className="stat-label">Realized Revenue</div>
                  <div style={pageStyles.previewValue}>{formatMoney(derivedMetrics.realizedRevenue)}</div>
                </div>
              </div>
              <p style={{ color: "var(--color-body)", fontSize: "13px", lineHeight: 1.5, margin: "12px 0 0" }}>
                Actual revenue collected from guests who have stayed or are currently in-house.
              </p>
            </div>
          </aside>

          <div style={pageStyles.heroGrid}>
            <article style={pageStyles.heroMetricCard}>
              <div className="stat-label">Projected Revenue</div>
              <div style={pageStyles.metricValue}>{formatMoney(derivedMetrics.projectedRevenue)}</div>
              <div className="stat-change" style={{ color: "var(--stripe-purple)" }}>
                Pipeline Bookings
              </div>
            </article>
            <article style={pageStyles.heroMetricCard}>
              <div className="stat-label">Occupancy Rate</div>
              <div style={pageStyles.metricValue}>{derivedMetrics.occupancyRate}%</div>
              <div className="stat-change" style={{ color: "var(--color-success-text)" }}>
                {rooms.filter(r => r.status === 'OCCUPIED').length} active stays
              </div>
            </article>
          </div>
        </section>

        <section style={pageStyles.sectionGrid}>
          <div style={pageStyles.generatorCard}>
            <h2 style={pageStyles.panelTitle}>Quick Export</h2>
            <p style={pageStyles.panelCopy}>
              Download the latest booking summary and room inventory states.
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "42px", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => window.print()}>Export PDF</button>
              <button className="btn-ghost">Email to Manager</button>
            </div>
          </div>

          <div style={pageStyles.bookingTableCard}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "start" }}>
              <div>
                <h2 style={pageStyles.panelTitle}>Recent Activity</h2>
                <p style={pageStyles.panelCopy}>Live flow of guest bookings and payments.</p>
              </div>
            </div>

            <div style={pageStyles.tableWrap}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Nights</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {derivedMetrics.recentBookings.map((booking) => {
                    const nights = getNights(booking.check_in_date, booking.check_out_date);
                    const price = typeof booking.price_per_night === "string" ? parseFloat(booking.price_per_night) : booking.price_per_night;
                    return (
                      <tr key={booking.reservation_id}>
                        <td>{formatDate(booking.booking_date)}</td>
                        <td>{booking.guest_name}</td>
                        <td>{booking.room_number}</td>
                        <td>{nights}</td>
                        <td>{formatMoney(price * nights)}</td>
                        <td>
                          <span className="status-pill paid">{booking.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section style={pageStyles.sectionGrid}>
          <div style={pageStyles.card}>
            <h2 style={pageStyles.panelTitle}>Operational Status</h2>
            <p style={pageStyles.panelCopy}>
              Real-time room availability and maintenance distribution.
            </p>
            <div style={{ marginTop: "48px" }}>
              <div style={{ fontSize: "64px", fontWeight: 300, color: "var(--stripe-purple)", marginBottom: "8px" }}>{derivedMetrics.occupancyRate}%</div>
              <p style={{ color: "var(--color-body)", fontSize: "14px" }}>Average Occupancy across {rooms.length} units</p>
            </div>
          </div>
          <div style={pageStyles.card}>
            <h2 style={pageStyles.panelTitle}>Room status mix</h2>
            <p style={pageStyles.panelCopy}>Snapshot of room availability and operational capacity.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
              {derivedMetrics.roomSegments.map((segment) => (
                <div key={segment.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--color-label)", fontSize: "14px" }}>{segment.label}</span>
                    <span style={{ color: "var(--color-heading)", fontFeatureSettings: '"tnum"', fontSize: "14px" }}>
                      {segment.value}
                    </span>
                  </div>
                  <div style={pageStyles.progressTrack}>
                    <div style={{ background: segment.color, height: "100%", width: segment.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={pageStyles.twoColumn}>
          <div style={pageStyles.card}>
            <h2 style={pageStyles.panelTitle}>Reservation funnel</h2>
            <p style={pageStyles.panelCopy}>Operational view of booking progress from pending to checkout.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
              {derivedMetrics.funnel.map((segment) => (
                <div key={segment.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--color-label)", fontSize: "14px" }}>{segment.label}</span>
                    <span style={{ color: "var(--color-heading)", fontFeatureSettings: '"tnum"', fontSize: "14px" }}>
                      {segment.value}
                    </span>
                  </div>
                  <div style={pageStyles.progressTrack}>
                    <div style={{ background: segment.color, height: "100%", width: segment.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Reports;
