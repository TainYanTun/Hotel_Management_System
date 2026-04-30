import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

interface Guest {
  guest_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id_type: string;
  id_number: string;
  created_at: string;
}

const Guests = () => {
  // Mock data for demonstration (remove when connected to real API)
  const [guests, setGuests] = useState<Guest[]>([
    { guest_id: 1, first_name: 'Wisa', last_name: 'Emad', email: 'wisa.emad@email.com', phone: '+1 555-0101', id_type: 'Passport', id_number: 'P12345678', created_at: '2026-04-30T10:00:00Z' },
    { guest_id: 2, first_name: 'Suman', last_name: '', email: 'suman@email.com', phone: '+1 555-0102', id_type: 'Driver License', id_number: 'DL9876543', created_at: '2026-04-28T14:30:00Z' },
    { guest_id: 3, first_name: 'Mario', last_name: 'Talat', email: 'mario.talat@email.com', phone: '+1 555-0103', id_type: 'National ID', id_number: 'NI4567890', created_at: '2026-04-15T09:15:00Z' },
    { guest_id: 4, first_name: 'Mario', last_name: 'Rizk', email: 'mario.rizk@email.com', phone: '+1 555-0104', id_type: 'Passport', id_number: 'P87654321', created_at: '2026-04-20T16:45:00Z' },
    { guest_id: 5, first_name: 'Sameh', last_name: 'Malak', email: 'sameh.malak@email.com', phone: '+1 555-0105', id_type: 'Passport', id_number: 'P11223344', created_at: '2026-04-25T11:20:00Z' },
  ]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newGuest, setNewGuest] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_type: 'Passport',
    id_number: ''
  });
  const [error, setError] = useState('');

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/guests');
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setGuests(data);
      } else {
        const text = await response.text();
        setError(`Server error (${response.status}): ${text.substring(0, 100)}`);
      }
    } catch (err: any) {
      console.error('Error fetching guests:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Using mock data for demonstration
    // TODO: Replace with real API call when database is connected
    // fetchGuests();
  }, []);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuest),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add guest');
      
      setGuests([...guests, data]);
      setShowModal(false);
      setNewGuest({ first_name: '', last_name: '', email: '', phone: '', id_type: 'Passport', id_number: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadge = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return <span style={styles.badgeNew}>New</span>;
    } else if (diffDays < 30) {
      return <span style={styles.badgeRecent}>Recent</span>;
    }
    return <span style={styles.badgeRegular}>Regular</span>;
  };

  return (
    <Layout>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Guest Management</h2>
          <p style={styles.subtitle}>Manage and monitor hotel guests</p>
        </div>
        <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>
          + Add Guest
        </button>
      </header>

      {loading ? (
        <div style={styles.loading}>Loading guests...</div>
      ) : (
        <section style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Guest ID</th>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Phone</th>
                <th style={styles.tableHeader}>ID Type</th>
                <th style={styles.tableHeader}>ID Number</th>
                <th style={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.emptyState}>
                    No guests found. Add your first guest to get started.
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest.guest_id} style={styles.tableRow}>
                    <td style={styles.tableCell}>#{guest.guest_id}</td>
                    <td style={styles.tableCell}>
                      <div style={styles.guestName}>{guest.first_name} {guest.last_name}</div>
                    </td>
                    <td style={styles.tableCell}>{guest.email}</td>
                    <td style={styles.tableCell}>{guest.phone}</td>
                    <td style={styles.tableCell}>{guest.id_type}</td>
                    <td style={styles.tableCell}><code style={styles.code}>{guest.id_number}</code></td>
                    <td style={styles.tableCell}>{getStatusBadge(guest.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Add New Guest</h3>
            <form onSubmit={handleAddGuest}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Name</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={newGuest.first_name}
                    onChange={(e) => setNewGuest({ ...newGuest, first_name: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={newGuest.last_name}
                    onChange={(e) => setNewGuest({ ...newGuest, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  style={styles.input}
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  required
                />
              </div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>ID Type</label>
                  <select
                    style={styles.select}
                    value={newGuest.id_type}
                    onChange={(e) => setNewGuest({ ...newGuest, id_type: e.target.value })}
                  >
                    <option value="Passport">Passport</option>
                    <option value="Driver License">Driver License</option>
                    <option value="National ID">National ID</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>ID Number</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={newGuest.id_number}
                    onChange={(e) => setNewGuest({ ...newGuest, id_number: e.target.value })}
                    required
                  />
                </div>
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnCancel} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.btnSubmit}>
                  Add Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 300,
    color: '#061b31',
    margin: 0,
    letterSpacing: '-0.26px',
  },
  subtitle: {
    color: '#64748d',
    fontSize: '14px',
    marginTop: '4px',
  },
  btnPrimary: {
    background: '#533afd',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#64748d',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5edf5',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    background: '#f8f9fa',
    borderBottom: '1px solid #e5edf5',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: '12px',
    fontWeight: 400,
    color: '#273951',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid #e5edf5',
  },
  tableCell: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#061b31',
  },
  guestName: {
    fontWeight: 500,
  },
  code: {
    background: '#f8f9fa',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '12px',
    fontFamily: 'SourceCodePro, monospace',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: '#64748d',
  },
  badgeNew: {
    background: 'rgba(83,58,253,0.1)',
    color: '#533afd',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 400,
  },
  badgeRecent: {
    rgba: 'rgba(21,190,83,0.2)',
    color: '#108c3d',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 400,
  },
  badgeRegular: {
    background: '#f8f9fa',
    color: '#64748d',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 400,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(6,27,49,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '32px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: 300,
    color: '#061b31',
    marginBottom: '24px',
    letterSpacing: '-0.22px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 400,
    color: '#273951',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5edf5',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#061b31',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5edf5',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#061b31',
    outline: 'none',
    background: '#ffffff',
    boxSizing: 'border-box',
  },
  error: {
    color: '#ea2261',
    fontSize: '13px',
    marginBottom: '16px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  btnCancel: {
    background: 'transparent',
    color: '#64748d',
    border: '1px solid #e5edf5',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 400,
    cursor: 'pointer',
  },
  btnSubmit: {
    background: '#533afd',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 400,
    cursor: 'pointer',
  },
};

export default Guests;
