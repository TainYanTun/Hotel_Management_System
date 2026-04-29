import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

interface Room {
  room_id: number;
  room_number: string;
  room_type: string;
  price_per_night: string;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE';
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    room_number: '',
    room_type: 'Standard',
    price_per_night: '',
    status: 'AVAILABLE'
  });
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setRooms(data);
      } else {
        const text = await response.text();
        setError(`Server error (${response.status}): ${text.substring(0, 100)}`);
      }
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add room');
      
      setRooms([...rooms, data]);
      setShowModal(false);
      setNewRoom({ room_number: '', room_type: 'Standard', price_per_night: '', status: 'AVAILABLE' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/rooms/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setRooms(rooms.map(r => r.room_id === id ? { ...r, status: newStatus as any } : r));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <Layout>
      <header className="dashboard-header">
        <div>
          <h2>Rooms Management</h2>
          <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Manage and monitor your hotel inventory</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Room
        </button>
      </header>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading rooms...</div>
      ) : (
        <section className="data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room No.</th>
                <th>Type</th>
                <th>Price / Night</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.room_id}>
                  <td style={{ fontWeight: 500 }}>{room.room_number}</td>
                  <td>{room.room_type}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${room.price_per_night}</td>
                  <td>
                    <span className={`status-pill ${room.status.toLowerCase()}`}>
                      {room.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={room.status} 
                      onChange={(e) => updateStatus(room.room_id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-default)', fontSize: '12px' }}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="RESERVED" disabled>Reserved</option>
                      <option value="OCCUPIED" disabled>Occupied</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add New Room</h3>
            {error && <p style={{ color: '#df1b41', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
            <form onSubmit={handleAddRoom}>
              <div className="form-group">
                <label>Room Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 101" 
                  required 
                  value={newRoom.room_number}
                  onChange={(e) => setNewRoom({...newRoom, room_number: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select 
                  value={newRoom.room_type}
                  onChange={(e) => setNewRoom({...newRoom, room_type: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-default)' }}
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price per Night ($)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 150" 
                  required 
                  value={newRoom.price_per_night}
                  onChange={(e) => setNewRoom({...newRoom, price_per_night: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-card {
          background: white;
          padding: 32px;
          border-radius: 8px;
          width: 400px;
          box-shadow: var(--shadow-lg);
        }
        .modal-card h3 { margin-bottom: 24px; font-weight: 500; }
      `}</style>
    </Layout>
  );
};

export default Rooms;
