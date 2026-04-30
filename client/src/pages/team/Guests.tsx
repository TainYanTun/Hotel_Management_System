import React, { useState, useEffect } from 'react';
import Layout from "../../components/Layout";

interface Guest {
  guest_id: number;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  id_passport: string;
  created_at: string;
}

const Guests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Partial<Guest> | null>(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/guests');
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentGuest?.guest_id ? 'PUT' : 'POST';
    const url = currentGuest?.guest_id 
      ? `/api/guests/${currentGuest.guest_id}` 
      : '/api/guests';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentGuest),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchGuests();
      }
    } catch (error) {
      console.error('Error saving guest:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      const response = await fetch(`/api/guests/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchGuests();
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const filteredGuests = guests.filter(guest => 
    guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone?.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="dashboard-header">
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--deep-navy)' }}>Guests</h2>
          <p style={{ color: 'var(--color-body)', fontSize: '16px', marginTop: '4px' }}>
            Manage guest profiles and contact information
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => {
            setCurrentGuest({});
            setIsModalOpen(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '20px' }}>+</span> Add Guest
        </button>
      </div>

      <div className="data-table-card" style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="form-group" style={{ marginBottom: 0, maxWidth: '400px' }}>
            <input 
              type="text" 
              placeholder="Search guests by name, email or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: '#f8f9fa',
                border: '1px solid var(--border-default)',
                borderRadius: '6px',
                padding: '12px 16px'
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-body)' }}>
            Loading guests...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>ID / Passport</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length > 0 ? (
                filteredGuests.map(guest => (
                  <tr key={guest.guest_id} className="table-row-hover">
                    <td>
                      <div style={{ fontWeight: 400, color: 'var(--deep-navy)' }}>{guest.full_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>ID: #{guest.guest_id}</div>
                    </td>
                    <td>
                      <div>{guest.email || 'No email'}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '2px' }}>{guest.phone || 'No phone'}</div>
                    </td>
                    <td>
                      <code style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '13px',
                        background: '#f1f5f9',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {guest.id_passport || '—'}
                      </code>
                    </td>
                    <td style={{ fontFeatureSettings: '"tnum"' }}>
                      {new Date(guest.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => {
                          setCurrentGuest(guest);
                          setIsModalOpen(true);
                        }}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--stripe-purple)', 
                          cursor: 'pointer',
                          marginRight: '12px',
                          fontSize: '14px'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(guest.guest_id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--ruby)', 
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-body)' }}>
                    No guests found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(6, 27, 49, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ 
            maxWidth: '600px', 
            padding: '40px',
            position: 'relative',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--color-body)'
              }}
            >
              &times;
            </button>
            <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>
              {currentGuest?.guest_id ? 'Edit Guest' : 'Add New Guest'}
            </h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required
                  value={currentGuest?.full_name || ''} 
                  onChange={e => setCurrentGuest({...currentGuest, full_name: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={currentGuest?.email || ''} 
                    onChange={e => setCurrentGuest({...currentGuest, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    value={currentGuest?.phone || ''} 
                    onChange={e => setCurrentGuest({...currentGuest, phone: e.target.value})}
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>ID / Passport Number</label>
                <input 
                  type="text" 
                  value={currentGuest?.id_passport || ''} 
                  onChange={e => setCurrentGuest({...currentGuest, id_passport: e.target.value})}
                  placeholder="Passport or ID number"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea 
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    border: '1px solid var(--border-default)',
                    borderRadius: '4px',
                    minHeight: '80px',
                    color: 'var(--color-heading)',
                    fontWeight: 300
                  }}
                  value={currentGuest?.address || ''} 
                  onChange={e => setCurrentGuest({...currentGuest, address: e.target.value})}
                  placeholder="Guest's home address"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {currentGuest?.guest_id ? 'Update Guest' : 'Create Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .table-row-hover {
          transition: background-color 0.1s ease;
        }
        .table-row-hover:hover {
          background-color: #f8f9fa;
        }
        .data-table th {
          font-weight: 400;
          color: var(--color-label);
          border-bottom: 2px solid var(--border-default);
        }
      `}</style>
    </Layout>
  );
};

export default Guests;
