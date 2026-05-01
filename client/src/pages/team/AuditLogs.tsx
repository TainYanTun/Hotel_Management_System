import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

type AuditLog = {
  log_id: number;
  user: string;
  action: string;
  entity_type: string;
  entity_id?: number;
  timestamp: string;
  details?: string;
};

const AuditLogs: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const rawRole = user.role || "Receptionist";
  const roleMap: Record<string, string> = {
    'ADMIN': 'Administrator',
    'FINANCE': 'Finance Officer',
    'MANAGER': 'Manager',
    'RECEPTIONIST': 'Receptionist'
  };
  const role = roleMap[rawRole] || rawRole;
  const isAuthorized = role === 'Administrator' || role === 'Manager';

  useEffect(() => {
    if (!isAuthorized) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [role, navigate, isAuthorized]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/audit-logs");
      const logsData = await response.json();
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const searchable = [l.user, l.action, l.entity_type, l.details]
        .join(" ")
        .toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());

      const ts = new Date(l.timestamp).getTime();
      const fromOk = fromDate
        ? ts >= new Date(`${fromDate}T00:00:00`).getTime()
        : true;
      const toOk = toDate
        ? ts <= new Date(`${toDate}T23:59:59`).getTime()
        : true;

      return matchesQuery && fromOk && toOk;
    });
  }, [logs, query, fromDate, toDate]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Layout>
      <style>{auditStyles}</style>
      <div className="auditPage">
        <section className="auditHero">
          <div>
            <span className="eyebrow">Security & Non-Repudiation</span>
            <h1>Audit Logs & System Activity</h1>
            <p>
              A permanent, immutable record of all administrative and
              operational actions performed within the Hotel Management System.
            </p>
          </div>
          <div className="heroActions">
            <button className="ghostButton" onClick={() => fetchData()}>
              Refresh Logs
            </button>
            <button className="primaryButton">Export CSV</button>
          </div>
        </section>

        <section className="logPanel">
          <div className="panelHeader">
            <div>
              <h2>Activity Feed</h2>
              <p>{filtered.length} logs matching current filters</p>
            </div>
            <div className="searchStack">
              <div className="searchControl">
                <span>Search</span>
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="dateFilters">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <span className="dateSep">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="tableScroller">
            <table className="auditTable">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User / Operator</th>
                  <th>Action Performed</th>
                  <th>Entity Reference</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="emptyState">
                      Loading historical logs...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="emptyState">
                      No logs found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.log_id}>
                      <td className="timestampCell">
                        {formatDate(log.timestamp)}
                      </td>
                      <td>
                        <div className="userBadge">
                          <span className="userIcon">
                            {log.user?.charAt(0).toUpperCase()}
                          </span>
                          <strong>{log.user || "System"}</strong>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`actionTag ${getActionType(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="entityCell">
                        <strong>{log.entity_type}</strong>
                        {log.entity_id && <span>#{log.entity_id}</span>}
                      </td>
                      <td className="detailsCell">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const getActionType = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("create") || a.includes("add")) return "action-create";
  if (a.includes("update") || a.includes("edit")) return "action-update";
  if (a.includes("delete") || a.includes("remove")) return "action-delete";
  if (a.includes("check")) return "action-op";
  return "action-default";
};

const auditStyles = `
  .auditPage {
    max-width: 1180px;
    margin: 0 auto;
    font-family: var(--font-sans);
    font-feature-settings: "ss01";
    color: #64748d;
  }

  .auditHero {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .auditHero h1 {
    margin: 8px 0 12px;
    color: #061b31;
    font-size: 48px;
    font-weight: 300;
    letter-spacing: -0.96px;
    line-height: 1.08;
  }

  .auditHero p {
    max-width: 710px;
    margin: 0;
    font-size: 18px;
    font-weight: 300;
    line-height: 1.4;
  }

  .eyebrow {
    color: #533afd;
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .heroActions {
    display: flex;
    gap: 12px;
  }

  .primaryButton, .ghostButton {
    padding: 10px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .primaryButton {
    background: #533afd;
    color: white;
    border: 1px solid #533afd;
    box-shadow: 0 4px 6px -1px rgba(83, 58, 253, 0.2);
  }

  .ghostButton {
    background: transparent;
    border: 1px solid #e5edf5;
    color: #533afd;
  }

  .workflowCard {
    background: #1c1e54;
    padding: 24px;
    border-radius: 6px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 48px;
  }

  .workflowHeader { min-width: 200px; }
  .workflowHeader h2 { color: white; margin: 4px 0 0; font-size: 22px; font-weight: 300; }
  
  .workflowSteps {
    display: flex;
    gap: 32px;
    margin: 0;
    padding: 0;
    list-style: none;
    flex-grow: 1;
  }

  .workflowSteps li { display: flex; gap: 12px; align-items: center; flex: 1; }
  .workflowSteps li span {
    width: 28px; height: 28px; min-width: 28px;
    display: grid; place-items: center;
    border: 1px solid rgba(255,255,255,0.22);
    border-radius: 4px; color: white; font-size: 12px;
  }

  .workflowSteps p { margin: 0; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 300; }

  .logPanel {
    background: white;
    border: 1px solid #e5edf5;
    border-radius: 6px;
    padding: 24px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
  }

  .panelHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .panelHeader h2 { margin: 0; font-size: 22px; color: #061b31; font-weight: 300; }
  
  .searchStack { display: flex; flex-direction: column; gap: 12px; align-items: flex-end; }
  
  .searchControl {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid #e5edf5; padding: 8px 12px; border-radius: 4px;
    min-width: 320px;
  }

  .searchControl input { border: none; outline: none; flex: 1; font-size: 14px; }
  
  .dateFilters { display: flex; align-items: center; gap: 8px; }
  .dateFilters input { border: 1px solid #e5edf5; padding: 6px; border-radius: 4px; font-size: 13px; }
  .dateSep { color: #94a3b8; font-size: 12px; }

  .auditTable { width: 100%; border-collapse: collapse; }
  .auditTable th { text-align: left; padding: 12px; border-bottom: 1px solid #e5edf5; color: #64748d; font-size: 12px; font-weight: 500; }
  .auditTable td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }

  .timestampCell { font-variant-numeric: tabular-nums; color: #64748d !important; font-size: 13px !important; }

  .userBadge { display: flex; align-items: center; gap: 10px; }
  .userIcon {
    width: 24px; height: 24px; background: #f1f5f9; border-radius: 50%;
    display: grid; place-items: center; font-size: 11px; font-weight: 600; color: #533afd;
  }

  .actionTag {
    padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 400;
  }
  .action-create { background: rgba(21, 190, 83, 0.1); color: #108c3d; border: 1px solid rgba(21, 190, 83, 0.2); }
  .action-update { background: rgba(83, 58, 253, 0.1); color: #533afd; border: 1px solid rgba(83, 58, 253, 0.2); }
  .action-delete { background: rgba(234, 34, 97, 0.1); color: #ea2261; border: 1px solid rgba(234, 34, 97, 0.2); }
  .action-op { background: rgba(245, 158, 11, 0.1); color: #b45309; border: 1px solid rgba(245, 158, 11, 0.2); }
  .action-default { background: #f8fafc; color: #64748d; border: 1px solid #e2e8f0; }

  .entityCell strong { display: block; color: #061b31; font-weight: 500; }
  .entityCell span { font-size: 12px; color: #64748d; }
  
  .detailsCell { max-width: 300px; color: #64748d; font-size: 13px; line-height: 1.4; }

  .emptyState { text-align: center; padding: 48px !important; color: #94a3b8; }

  @media (max-width: 960px) {
    .auditHero { flex-direction: column; }
    .workflowCard { flex-direction: column; align-items: flex-start; }
    .workflowSteps { flex-direction: column; width: 100%; }
    .panelHeader { flex-direction: column; gap: 16px; }
    .searchStack { align-items: flex-start; width: 100%; }
    .searchControl { min-width: 100%; }
  }
`;

export default AuditLogs;
