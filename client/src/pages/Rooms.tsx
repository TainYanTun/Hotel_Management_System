import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
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
            <Link to="/dashboard" className="nav-link">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/rooms" className="nav-link active">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h5m-5 4h5" />
              </svg>
              Rooms
            </Link>
          </li>
        </nav>
      </aside>

      <main className="main-content">
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
      </main>

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
    </div>
  );
};

export default Rooms;
