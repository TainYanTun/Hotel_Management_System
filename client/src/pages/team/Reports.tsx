import type { CSSProperties } from "react";
import Layout from "../../components/Layout";

type Trend = "up" | "down" | "steady";

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: Trend;
}

interface RevenuePoint {
  month: string;
  revenue: number;
}

interface Segment {
  label: string;
  value: string;
  width: string;
  color: string;
}

interface ReportRow {
  name: string;
  owner: string;
  cadence: string;
  status: "Ready" | "Review" | "Draft";
}

interface BookingRow {
  date: string;
  guest: string;
  room: string;
  nights: number;
  amount: string;
  status: "Confirmed" | "Paid" | "Pending";
}

const metrics: MetricCard[] = [
  {
    label: "Monthly revenue",
    value: "$48,920",
    change: "+12.4% vs last month",
    trend: "up",
  },
  {
    label: "Occupancy rate",
    value: "78%",
    change: "+6 rooms occupied",
    trend: "up",
  },
  {
    label: "Confirmed stays",
    value: "126",
    change: "18 pending follow-ups",
    trend: "steady",
  },
  {
    label: "Service revenue",
    value: "$7,840",
    change: "-3.1% vs last month",
    trend: "down",
  },
];

const revenueSeries: RevenuePoint[] = [
  { month: "Jan", revenue: 36 },
  { month: "Feb", revenue: 42 },
  { month: "Mar", revenue: 39 },
  { month: "Apr", revenue: 49 },
  { month: "May", revenue: 54 },
  { month: "Jun", revenue: 58 },
];

const roomSegments: Segment[] = [
  { label: "Occupied", value: "35 rooms", width: "78%", color: "var(--stripe-purple)" },
  { label: "Reserved", value: "6 rooms", width: "13%", color: "#665efd" },
  { label: "Available", value: "3 rooms", width: "7%", color: "var(--color-success)" },
  { label: "Maintenance", value: "1 room", width: "2%", color: "var(--ruby)" },
];

const funnel: Segment[] = [
  { label: "Pending", value: "18", width: "38%", color: "#ffd7ef" },
  { label: "Confirmed", value: "74", width: "86%", color: "#d6d9fc" },
  { label: "Checked in", value: "35", width: "62%", color: "#b9b9f9" },
  { label: "Checked out", value: "52", width: "70%", color: "rgba(21, 190, 83, 0.28)" },
];

const reports: ReportRow[] = [
  {
    name: "Revenue summary",
    owner: "Finance",
    cadence: "Daily",
    status: "Ready",
  },
  {
    name: "Occupancy performance",
    owner: "Manager",
    cadence: "Daily",
    status: "Ready",
  },
  {
    name: "Guest activity",
    owner: "Reception",
    cadence: "Weekly",
    status: "Review",
  },
  {
    name: "Audit health",
    owner: "Admin",
    cadence: "Weekly",
    status: "Draft",
  },
];

const bookingRows: BookingRow[] = [
  {
    date: "19 Apr",
    guest: "Chatmongkol K.",
    room: "205",
    nights: 3,
    amount: "฿14,400",
    status: "Confirmed",
  },
  {
    date: "17 Apr",
    guest: "Phiangphailin C.",
    room: "201",
    nights: 2,
    amount: "฿6,105",
    status: "Paid",
  },
  {
    date: "15 Apr",
    guest: "Six Seven",
    room: "207",
    nights: 1,
    amount: "฿1,284",
    status: "Paid",
  },
  {
    date: "13 Apr",
    guest: "Nora Bennett",
    room: "302",
    nights: 4,
    amount: "฿18,920",
    status: "Pending",
  },
];

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

const getTrendColor = (trend: Trend) => {
  if (trend === "up") return "var(--color-success-text)";
  if (trend === "down") return "var(--ruby)";
  return "var(--color-label)";
};

const getStatusClass = (status: ReportRow["status"]) => {
  if (status === "Ready") return "paid";
  if (status === "Review") return "pending";
  return "";
};

const getBookingStatusClass = (status: BookingRow["status"]) => {
  if (status === "Paid") return "paid";
  if (status === "Pending") return "pending";
  return "";
};

const Reports = () => {
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
                  <div className="stat-label">April performance</div>
                  <div style={pageStyles.previewValue}>฿48,920</div>
                </div>
                <span style={pageStyles.previewBadge}>+12.4%</span>
              </div>
              <p style={{ color: "var(--color-body)", fontSize: "13px", lineHeight: 1.5, margin: "12px 0 0" }}>
                Revenue is trending above target with occupancy holding at 78%.
              </p>
            </div>
            <div style={pageStyles.previewChart}>
              {revenueSeries.map((point) => (
                <div
                  key={point.month}
                  style={{
                    ...pageStyles.previewBar,
                    height: `${point.revenue * 1.35}px`,
                  }}
                  title={`${point.month}: $${point.revenue}k`}
                />
              ))}
            </div>
          </aside>

          <div style={pageStyles.heroGrid}>
            {metrics.map((metric) => (
              <article key={metric.label} style={pageStyles.heroMetricCard}>
                <div className="stat-label">{metric.label}</div>
                <div style={pageStyles.metricValue}>{metric.value}</div>
                <div className="stat-change" style={{ color: getTrendColor(metric.trend) }}>
                  {metric.change}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={pageStyles.sectionGrid}>
          <div style={pageStyles.generatorCard}>
            <h2 style={pageStyles.panelTitle}>Generate report</h2>
            <p style={pageStyles.panelCopy}>
              Choose a report period and export a clean summary for management review.
            </p>

            <div style={pageStyles.filterGrid}>
              <label style={pageStyles.field}>
                <span style={pageStyles.fieldLabel}>Report type</span>
                <span style={pageStyles.fieldBox}>Booking report</span>
              </label>
              <label style={pageStyles.field}>
                <span style={pageStyles.fieldLabel}>Period</span>
                <span style={pageStyles.fieldBox}>April 2026</span>
              </label>
              <label style={pageStyles.field}>
                <span style={pageStyles.fieldLabel}>Status</span>
                <span style={pageStyles.fieldBox}>All bookings</span>
              </label>
              <label style={pageStyles.field}>
                <span style={pageStyles.fieldLabel}>Format</span>
                <span style={pageStyles.fieldBox}>PDF + CSV</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "22px", flexWrap: "wrap" }}>
              <button className="btn-primary">Generate report</button>
              <button className="btn-ghost">Schedule monthly</button>
            </div>
          </div>

          <div style={pageStyles.bookingTableCard}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "start" }}>
              <div>
                <h2 style={pageStyles.panelTitle}>Booking report</h2>
                <p style={pageStyles.panelCopy}>April 2026 room revenue and guest stays.</p>
              </div>
              <span className="status-pill paid">Ready</span>
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
                  {bookingRows.map((booking) => (
                    <tr key={`${booking.date}-${booking.room}`}>
                      <td>{booking.date}</td>
                      <td>{booking.guest}</td>
                      <td>{booking.room}</td>
                      <td>{booking.nights}</td>
                      <td>{booking.amount}</td>
                      <td>
                        <span className={`status-pill ${getBookingStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section style={pageStyles.sectionGrid}>
          <div style={pageStyles.card}>
            <h2 style={pageStyles.panelTitle}>Revenue trend</h2>
            <p style={pageStyles.panelCopy}>
              Monthly payment performance prepared for finance and manager review.
            </p>
            <div style={pageStyles.chart}>
              {revenueSeries.map((point) => (
                <div key={point.month} style={pageStyles.barWrap}>
                  <div
                    style={{
                      ...pageStyles.bar,
                      height: `${point.revenue * 3}px`,
                    }}
                    title={`$${point.revenue}k`}
                  />
                  <span style={{ color: "var(--color-label)", fontSize: "12px", textAlign: "center" }}>
                    {point.month}
                  </span>
                  <span
                    style={{
                      color: "var(--color-body)",
                      fontFeatureSettings: '"tnum"',
                      fontSize: "11px",
                      textAlign: "center",
                    }}
                  >
                    ${point.revenue}k
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={pageStyles.card}>
            <h2 style={pageStyles.panelTitle}>Room status mix</h2>
            <p style={pageStyles.panelCopy}>Snapshot of room availability and operational capacity.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
              {roomSegments.map((segment) => (
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
              {funnel.map((segment) => (
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

        <section className="data-table-card">
          <div className="card-header" style={{ alignItems: "start", display: "flex", justifyContent: "space-between" }}>
            <div>
              <h2 style={pageStyles.panelTitle}>Report catalog</h2>
              <p style={pageStyles.panelCopy}>
                Planned analytics outputs aligned to database entities and team responsibilities.
              </p>
            </div>
            <button className="btn-ghost">Export CSV</button>
          </div>

          <div style={pageStyles.tableWrap}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Owner</th>
                  <th>Cadence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.name}>
                    <td>{report.name}</td>
                    <td>{report.owner}</td>
                    <td>{report.cadence}</td>
                    <td>
                      <span className={`status-pill ${getStatusClass(report.status)}`}>{report.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Reports;
