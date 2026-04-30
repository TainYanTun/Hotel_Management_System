import React, { useMemo, useState } from 'react';
import Layout from '../../components/Layout';

type AuditLog = {
  log_id: number;
  user: string;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  timestamp: string;
  details?: string;
};

const SAMPLE_LOGS: AuditLog[] = [
  { log_id: 1, user: 'admin', user_id: 1, action: 'Created reservation', entity_type: 'reservation', entity_id: 101, timestamp: '2026-04-29T09:14:00Z', details: 'Guest: John Doe — 2 nights' },
  { log_id: 2, user: 'reception1', user_id: 3, action: 'Checked in guest', entity_type: 'checkin', entity_id: 55, timestamp: '2026-04-29T10:02:00Z', details: 'Reservation 101 — Room 204' },
  { log_id: 3, user: 'finance', user_id: 4, action: 'Recorded payment', entity_type: 'payment', entity_id: 301, timestamp: '2026-04-29T11:30:00Z', details: 'Invoice 201 — CARD — 120.00' },
  { log_id: 4, user: 'manager', user_id: 2, action: 'Updated room status to MAINTENANCE', entity_type: 'room', entity_id: 12, timestamp: '2026-04-28T16:20:00Z', details: 'Scheduled maintenance' },
];

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5edf5',
  borderRadius: 8,
  padding: 20,
  boxShadow: '0px 30px 45px -30px rgba(50,50,93,0.25), 0px 18px 36px -18px rgba(0,0,0,0.1)',
};

const primaryButton: React.CSSProperties = {
  background: '#533afd',
  color: '#ffffff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 6,
  cursor: 'pointer',
};

const AuditLogs: React.FC = () => {
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => {
    return SAMPLE_LOGS.filter((l) => {
      const matchesQuery = query
        ? [l.user, l.action, l.entity_type, l.details].join(' ').toLowerCase().includes(query.toLowerCase())
        : true;
      const ts = new Date(l.timestamp).getTime();
      const fromOk = from ? ts >= new Date(from).getTime() : true;
      const toOk = to ? ts <= new Date(to).getTime() : true;
      return matchesQuery && fromOk && toOk;
    }).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  }, [query, from, to]);

  return (
    <Layout>
      <div style={{ padding: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <h2 style={{ color: '#061b31', fontSize: 28, margin: 0, fontWeight: 300 }}>🛡️ Audit Logs</h2>
            <p style={{ color: '#64748d', marginTop: 8, marginBottom: 0 }}>Non-repudiation records for system actions. Based on schema: audit_logs.</p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={primaryButton}>Export</button>
          </div>
        </div>

        <div style={{ marginTop: 20, ...cardStyle }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <input
              placeholder="Search user, action, entity or details"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #e5edf5' }}
            />

            <div style={{ display: 'flex', gap: 8 }}>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{ padding: '8px', borderRadius: 6, border: '1px solid #e5edf5' }} />
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ padding: '8px', borderRadius: 6, border: '1px solid #e5edf5' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5edf5' }}>
                  <th style={{ padding: '12px 8px', color: '#061b31' }}>Time</th>
                  <th style={{ padding: '12px 8px', color: '#061b31' }}>User</th>
                  <th style={{ padding: '12px 8px', color: '#061b31' }}>Action</th>
                  <th style={{ padding: '12px 8px', color: '#061b31' }}>Entity</th>
                  <th style={{ padding: '12px 8px', color: '#061b31' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 20, color: '#64748d' }}>
                      No audit logs match your filters.
                    </td>
                  </tr>
                )}
                {filtered.map((log) => (
                  <tr key={log.log_id} style={{ borderBottom: '1px solid #f1f6fb' }}>
                    <td style={{ padding: '12px 8px', verticalAlign: 'top', color: '#273951' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '12px 8px', verticalAlign: 'top', color: '#061b31', fontWeight: 600 }}>{log.user}</td>
                    <td style={{ padding: '12px 8px', verticalAlign: 'top', color: '#64748d' }}>{log.action}</td>
                    <td style={{ padding: '12px 8px', verticalAlign: 'top', color: '#64748d' }}>{log.entity_type}{log.entity_id ? ` #${log.entity_id}` : ''}</td>
                    <td style={{ padding: '12px 8px', verticalAlign: 'top', color: '#273951' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuditLogs;
