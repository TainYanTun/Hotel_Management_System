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
  
  const isViewOnly = role === 'Manager';

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
    if (isViewOnly) return;

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
    if (isViewOnly) return;
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
      <style>{guestStyles}</style>
      <div className="guestsPage">
        <section className="guestsHero">
          <div>
            <span className="eyebrow">Relationship Management</span>
            <h1>Manage guest profiles, contact history, and identity records.</h1>
            <p>
              A high-fidelity record system for maintaining deep guest relationships
              and ensuring operational accuracy.
            </p>
          </div>
          {!isViewOnly && (
            <div className="heroActions">
              <button className="ghostButton" onClick={fetchGuests}>Refresh Feed</button>
              <button 
                className="primaryButton" 
                onClick={() => {
                  setCurrentGuest({});
                  setIsModalOpen(true);
                }}
              >
                + Add Guest
              </button>
            </div>
          )}
        </section>

        <section className="guestsPanel">
          <div className="panelHeader">
            <div>
              <h2>Guest Directory</h2>
              <p>{filteredGuests.length} profiles found</p>
            </div>
            <div className="searchControl">
              <span>Search</span>
              <input 
                type="text" 
                placeholder="Name, email, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="tableScroller">
            <table className="guestsTable">
              <thead>
                <tr>
                  <th>Guest Profile</th>
                  <th>Contact Information</th>
                  <th>ID / Passport</th>
                  <th>Relationship Date</th>
                  {!isViewOnly && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={isViewOnly ? 4 : 5} className="emptyState">Loading guest records...</td></tr>
                ) : filteredGuests.length === 0 ? (
                  <tr><td colSpan={isViewOnly ? 4 : 5} className="emptyState">No guests found matching your search.</td></tr>
                ) : (
                  filteredGuests.map(guest => (
                    <tr key={guest.guest_id}>
                      <td>
                        <strong>{guest.full_name}</strong>
                        <span>ID: #{guest.guest_id}</span>
                      </td>
                      <td>
                        <div className="contactInfo">
                          <p>{guest.email || 'No email provided'}</p>
                          <span>{guest.phone || 'No phone provided'}</span>
                        </div>
                      </td>
                      <td>
                        <code className="monoBadge">{guest.id_passport || '—'}</code>
                      </td>
                      <td className="numericCell">
                        {new Date(guest.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      {!isViewOnly && (
                        <td>
                          <div className="actionGroup">
                            <button 
                              className="editBtn"
                              onClick={() => {
                                setCurrentGuest(guest);
                                setIsModalOpen(true);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="deleteBtn"
                              onClick={() => handleDelete(guest.guest_id)}
                            >
                              ×
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <span className="eyebrow">Relationship Form</span>
                <h2>{currentGuest?.guest_id ? 'Edit Profile' : 'Register Guest'}</h2>
              </div>
              <button className="closeBtn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSave} className="guestForm">
              <label>
                Full Name
                <input 
                  type="text" 
                  required
                  disabled={isViewOnly}
                  value={currentGuest?.full_name || ''} 
                  onChange={e => setCurrentGuest({...currentGuest, full_name: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label>
                  Email Address
                  <input 
                    type="email" 
                    disabled={isViewOnly}
                    value={currentGuest?.email || ''} 
                    onChange={e => setCurrentGuest({...currentGuest, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </label>
                <label>
                  Phone Number
                  <input 
                    type="text" 
                    disabled={isViewOnly}
                    value={currentGuest?.phone || ''} 
                    onChange={e => setCurrentGuest({...currentGuest, phone: e.target.value})}
                    placeholder="+1 234 567 890"
                  />
                </label>
              </div>
              <label>
                ID / Passport Number
                <input 
                  type="text" 
                  disabled={isViewOnly}
                  value={currentGuest?.id_passport || ''} 
                  onChange={e => setCurrentGuest({...currentGuest, id_passport: e.target.value})}
                  placeholder="Passport or ID number"
                />
              </label>
              <label>
                Address
                <textarea 
                  disabled={isViewOnly}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '1px solid #e5edf5',
                    borderRadius: '4px',
                    minHeight: '80px',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                  value={currentGuest?.address || ''} 
                  onChange={e => setCurrentGuest({...currentGuest, address: e.target.value})}
                  placeholder="Guest's home address"
                />
              </label>
              {!isViewOnly && (
                <div className="modalActions">
                  <button type="button" className="ghostButton" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primaryButton">
                    {currentGuest?.guest_id ? 'Update Record' : 'Commit Registration'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Guests;

const guestStyles = `
  .guestsPage {
    max-width: 1180px;
    margin: 0 auto;
    font-family: var(--font-sans);
    font-feature-settings: "ss01";
    color: #64748d;
  }

  .guestsHero {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .guestsHero h1 {
    margin: 8px 0 12px;
    color: #061b31;
    font-size: 48px;
    font-weight: 300;
    letter-spacing: -0.96px;
    line-height: 1.08;
    max-width: 800px;
  }

  .guestsHero p {
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

  .heroActions { display: flex; gap: 12px; }

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

  .guestsPanel {
    background: white;
    border: 1px solid #e5edf5;
    border-radius: 6px;
    padding: 24px;
    box-shadow: var(--shadow-elevated);
  }

  .panelHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .panelHeader h2 { margin: 0; font-size: 22px; color: #061b31; font-weight: 300; }
  
  .searchControl {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid #e5edf5; padding: 8px 12px; border-radius: 4px;
    min-width: 300px;
  }

  .searchControl input { border: none; outline: none; flex: 1; font-size: 14px; }

  .guestsTable { width: 100%; border-collapse: collapse; }
  .guestsTable th { text-align: left; padding: 12px; border-bottom: 1px solid #e5edf5; color: #64748d; font-size: 12px; font-weight: 500; }
  .guestsTable td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }

  .contactInfo p { margin: 0; font-weight: 500; color: #061b31; }
  .contactInfo span { font-size: 13px; color: #64748d; }

  .monoBadge {
    font-family: var(--font-mono);
    font-size: 12px;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    color: #475569;
  }

  .numericCell { font-variant-numeric: tabular-nums; }

  .actionGroup { display: flex; gap: 12px; align-items: center; }
  .editBtn { background: transparent; border: none; color: #533afd; font-size: 14px; cursor: pointer; font-weight: 500; }
  .deleteBtn {
    background: transparent; border: none; color: #94a3b8;
    font-size: 20px; cursor: pointer; transition: color 0.15s;
  }
  .deleteBtn:hover { color: #ea2261; }

  .modalOverlay {
    position: fixed; inset: 0; background: rgba(6, 27, 49, 0.5);
    display: grid; place-items: center; z-index: 1000; padding: 24px;
  }

  .modalCard {
    background: white; border-radius: 8px; width: min(520px, 100%);
    box-shadow: var(--shadow-elevated);
  }

  .modalHeader {
    padding: 24px; border-bottom: 1px solid #e5edf5;
    display: flex; justify-content: space-between; align-items: flex-start;
  }

  .closeBtn { background: transparent; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; }
  
  .guestForm { padding: 24px; display: grid; gap: 16px; }
  .guestForm label { display: grid; gap: 8px; font-size: 13px; color: #475569; }
  .guestForm input, .guestForm textarea {
    padding: 10px 12px; border: 1px solid #e5edf5; border-radius: 4px;
    font-size: 14px; color: #0f172a; outline: none;
  }
  .guestForm input:focus, .guestForm textarea:focus { border-color: #533afd; box-shadow: 0 0 0 2px rgba(83, 58, 253, 0.1); }
  
  .modalActions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px; }

  .emptyState { text-align: center; padding: 48px !important; color: #94a3b8; }
`;
