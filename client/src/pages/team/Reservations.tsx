import React, { useState } from 'react';
import Layout from '../../components/Layout';

// Mock data for UI demonstration (no API required)
const mockReservations = [
  { reservation_id: 1, guest_name: 'John Smith', room_number: '101', room_type: 'Standard', check_in_date: '2026-05-01', check_out_date: '2026-05-03', status: 'CONFIRMED', price: 150 },
  { reservation_id: 2, guest_name: 'Sarah Johnson', room_number: '205', room_type: 'Deluxe', check_in_date: '2026-05-02', check_out_date: '2026-05-05', status: 'PENDING', price: 280 },
  { reservation_id: 3, guest_name: 'Michael Brown', room_number: '302', room_type: 'Suite', check_in_date: '2026-04-28', check_out_date: '2026-05-01', status: 'CHECKED_IN', price: 450 },
  { reservation_id: 4, guest_name: 'Emily Davis', room_number: '108', room_type: 'Standard', check_in_date: '2026-04-25', check_out_date: '2026-04-28', status: 'CHECKED_OUT', price: 180 },
  { reservation_id: 5, guest_name: 'David Wilson', room_number: '401', room_type: 'Presidential', check_in_date: '2026-05-10', check_out_date: '2026-05-15', status: 'CANCELLED', price: 750 },
];

const mockGuests = [
  { guest_id: 1, full_name: 'John Smith', email: 'john@example.com', phone: '+1 555-0101' },
  { guest_id: 2, full_name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 555-0102' },
  { guest_id: 3, full_name: 'Michael Brown', email: 'michael@example.com', phone: '+1 555-0103' },
  { guest_id: 4, full_name: 'Emily Davis', email: 'emily@example.com', phone: '+1 555-0104' },
  { guest_id: 5, full_name: 'David Wilson', email: 'david@example.com', phone: '+1 555-0105' },
];

const mockRooms = [
  { room_id: 1, room_number: '101', room_type: 'Standard', status: 'AVAILABLE', price_per_night: 75 },
  { room_id: 2, room_number: '205', room_type: 'Deluxe', status: 'AVAILABLE', price_per_night: 140 },
  { room_id: 3, room_number: '302', room_type: 'Suite', status: 'OCCUPIED', price_per_night: 225 },
  { room_id: 4, room_number: '108', room_type: 'Standard', status: 'AVAILABLE', price_per_night: 90 },
  { room_id: 5, room_number: '401', room_type: 'Presidential', status: 'RESERVED', price_per_night: 375 },
];

const Reservations = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ guest_id: '', room_id: '', check_in_date: '', check_out_date: '' });

  const filteredData = mockReservations.filter(res => {
    const matchesStatus = filterStatus === 'ALL' || res.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      res.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.room_number.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    const map: Record<string, { bg: string; text: string; border: string }> = {
      PENDING: { bg: 'rgba(83,58,253,0.1)', text: '#533afd', border: 'rgba(83,58,253,0.3)' },
      CONFIRMED: { bg: 'rgba(21,190,83,0.2)', text: '#108c3d', border: 'rgba(21,190,83,0.4)' },
      CANCELLED: { bg: 'rgba(234,34,97,0.1)', text: '#ea2261', border: 'rgba(234,34,97,0.3)' },
      CHECKED_IN: { bg: 'rgba(50,50,93,0.15)', text: '#061b31', border: 'rgba(50,50,93,0.3)' },
      CHECKED_OUT: { bg: 'rgba(100,116,141,0.15)', text: '#64748d', border: 'rgba(100,116,141,0.3)' },
    };
    return map[status] || map.PENDING;
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const getNights = (inDate: string, outDate: string) => Math.ceil((new Date(outDate).getTime() - new Date(inDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Layout>
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Reservations</h1>
            <p style={styles.subtitle}>Manage hotel bookings and reservations</p>
          </div>
          <button style={styles.primaryButton} onClick={() => setShowModal(true)}>+ New Reservation</button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Search by guest or room..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.statusFilters}>
            {['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].map(status => (
              <button key={status} onClick={() => setFilterStatus(status)} style={{ ...styles.filterButton, ...(filterStatus === status ? styles.filterButtonActive : {}) }}>
                {status === 'ALL' ? 'All' : status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table Card */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Guest</th>
                <th style={styles.th}>Room</th>
                <th style={styles.th}>Check-in</th>
                <th style={styles.th}>Check-out</th>
                <th style={styles.th}>Nights</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(res => {
                const badge = getStatusStyle(res.status);
                const nights = getNights(res.check_in_date, res.check_out_date);
                return (
                  <tr key={res.reservation_id} style={styles.tableRow}>
                    <td style={styles.td}>#{res.reservation_id}</td>
                    <td style={styles.td}><span style={styles.guestName}>{res.guest_name}</span></td>
                    <td style={styles.td}><span style={styles.roomBadge}>{res.room_number} <small>{res.room_type}</small></span></td>
                    <td style={styles.td}>{formatDate(res.check_in_date)}</td>
                    <td style={styles.td}>{formatDate(res.check_out_date)}</td>
                    <td style={styles.td}><span style={styles.nightsBadge}>{nights}</span></td>
                    <td style={styles.td}><strong>${res.price * nights}</strong></td>
                    <td style={styles.td}><span style={{ ...styles.statusBadge, backgroundColor: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}>{res.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>New Reservation</h2>
                <button onClick={() => setShowModal(false)} style={styles.modalClose}>×</button>
              </div>
              <form style={styles.form} onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Guest</label>
                  <select style={styles.select} value={formData.guest_id} onChange={e => setFormData({...formData, guest_id: e.target.value})}>
                    <option value="">Select a guest</option>
                    {mockGuests.map(g => <option key={g.guest_id} value={g.guest_id}>{g.full_name}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Room</label>
                  <select style={styles.select} value={formData.room_id} onChange={e => setFormData({...formData, room_id: e.target.value})}>
                    <option value="">Select a room</option>
                    {mockRooms.filter(r => r.status === 'AVAILABLE').map(r => <option key={r.room_id} value={r.room_id}>{r.room_number} - {r.room_type} (${r.price_per_night}/night)</option>)}
                  </select>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Check-in</label>
                    <input type="date" style={styles.input} value={formData.check_in_date} onChange={e => setFormData({...formData, check_in_date: e.target.value})} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Check-out</label>
                    <input type="date" style={styles.input} value={formData.check_out_date} onChange={e => setFormData({...formData, check_out_date: e.target.value})} />
                  </div>
                </div>
                <div style={styles.modalActions}>
                  <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
                  <button type="submit" style={styles.submitButton}>Create Reservation</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '32px', maxWidth: '1080px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: 300, color: '#061b31', letterSpacing: '-0.64px', margin: 0, fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  subtitle: { fontSize: '16px', fontWeight: 300, color: '#64748d', margin: '8px 0 0 0' },
  primaryButton: { backgroundColor: '#533afd', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '14px', fontWeight: 400, cursor: 'pointer', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  filters: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e5edf5', borderRadius: '4px', padding: '8px 12px', minWidth: '280px' },
  searchIcon: { marginRight: '8px', opacity: 0.5 },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#061b31', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  statusFilters: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterButton: { backgroundColor: 'transparent', border: '1px solid #e5edf5', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', color: '#64748d', cursor: 'pointer', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  filterButtonActive: { backgroundColor: '#533afd', borderColor: '#533afd', color: '#ffffff' },
  tableCard: { backgroundColor: '#ffffff', border: '1px solid #e5edf5', borderRadius: '6px', boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e5edf5' },
  th: { textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 400, color: '#64748d', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tableRow: { borderBottom: '1px solid #e5edf5' },
  td: { padding: '16px', fontSize: '14px', color: '#061b31' },
  guestName: { fontWeight: 400, color: '#061b31' },
  roomBadge: { backgroundColor: 'rgba(83,58,253,0.08)', color: '#533afd', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 400, display: 'inline-block' },
  nightsBadge: { backgroundColor: 'rgba(50,50,93,0.08)', color: '#061b31', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 400 },
  statusBadge: { padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 400, display: 'inline-block' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(6,27,49,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#ffffff', borderRadius: '6px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflow: 'auto', boxShadow: 'rgba(3,3,39,0.25) 0px 14px 21px -14px, rgba(0,0,0,0.1) 0px 8px 17px -8px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5edf5' },
  modalTitle: { fontSize: '22px', fontWeight: 300, color: '#061b31', margin: 0, letterSpacing: '-0.22px', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  modalClose: { background: 'none', border: 'none', fontSize: '24px', color: '#64748d', cursor: 'pointer', padding: 0, lineHeight: 1 },
  form: { padding: '24px' },
  formGroup: { marginBottom: '20px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 400, color: '#273951', marginBottom: '8px', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #e5edf5', borderRadius: '4px', fontSize: '14px', color: '#061b31', outline: 'none', boxSizing: 'border-box', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #e5edf5', borderRadius: '4px', fontSize: '14px', color: '#061b31', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px 24px', borderTop: '1px solid #e5edf5' },
  cancelButton: { backgroundColor: 'transparent', border: '1px solid #e5edf5', borderRadius: '4px', padding: '10px 20px', fontSize: '14px', color: '#64748d', cursor: 'pointer', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
  submitButton: { backgroundColor: '#533afd', border: 'none', borderRadius: '4px', padding: '10px 20px', fontSize: '14px', color: '#ffffff', cursor: 'pointer', fontFamily: 'sohne-var, SF Pro Display, system-ui' },
};

export default Reservations;
