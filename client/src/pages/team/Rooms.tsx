import { useMemo, useState, useEffect } from "react";
import Layout from "../../components/Layout";

type RoomStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED" | "MAINTENANCE";

type Room = {
  room_id: number;
  room_number: string;
  room_type: string;
  status: RoomStatus;
  price_per_night: number | string;
};

type FormData = {
  room_number: string;
  room_type: string;
  price_per_night: string;
  status: RoomStatus;
};

const roomTypes = ["Standard", "Deluxe", "Suite", "Penthouse"];
const statusOptions: Array<RoomStatus | "ALL"> = [
  "ALL",
  "AVAILABLE",
  "RESERVED",
  "OCCUPIED",
  "MAINTENANCE",
];

const emptyForm: FormData = {
  room_number: "",
  room_type: "Standard",
  price_per_night: "",
  status: "AVAILABLE",
};

const formatMoney = (amount: number | string) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const humanizeStatus = (status: string) =>
  status
    ? status
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ")
    : "—";

const getStatusClassName = (status: RoomStatus) =>
  `statusBadge status-${status.toLowerCase().replace("_", "-")}`;

const Rooms = () => {
  const [filterStatus, setFilterStatus] = useState<RoomStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  const isAdmin = role === 'Administrator';
  const isReceptionist = role === 'Receptionist';
  const isManager = role === 'Manager';

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add room");

      setRooms([...rooms, data]);
      closeModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateRoomStatus = async (id: number, newStatus: RoomStatus) => {
    try {
      const response = await fetch(`/api/rooms/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setRooms(
          rooms.map((r) =>
            r.room_id === id ? { ...r, status: newStatus } : r,
          ),
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const response = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      if (response.ok) {
        setRooms(rooms.filter((r) => r.room_id !== id));
      }
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        const matchesStatus =
          filterStatus === "ALL" || room.status === filterStatus;
        const searchable = [room.room_number, room.room_type, room.status]
          .join(" ")
          .toLowerCase();
        return matchesStatus && searchable.includes(searchTerm.toLowerCase());
      }),
    [rooms, filterStatus, searchTerm],
  );

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyForm);
    setError("");
  };

  return (
    <Layout>
      <style>{roomStyles}</style>
      <div className="roomsPage">
        <section className="roomsHero">
          <div>
            <span className="eyebrow">Inventory Control</span>
            <h1>Manage hotel rooms, pricing, and availability states.</h1>
            <p>
              A high-fidelity surface for maintaining your room inventory,
              monitoring real-time status, and adjusting market rates.
            </p>
          </div>
          {isAdmin && (
            <div className="heroActions">
              <button className="ghostButton" onClick={fetchRooms}>
                Refresh Feed
              </button>
              <button
                className="primaryButton"
                onClick={() => setShowModal(true)}
              >
                + Add Room
              </button>
            </div>
          )}
        </section>

        <section className="roomsPanel">
          <div className="panelHeader">
            <div>
              <h2>Room Inventory</h2>
              <p>{filteredRooms.length} rooms match your view</p>
            </div>
            <div className="searchControl">
              <span>Search</span>
              <input
                type="text"
                placeholder="Room #, type, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="statusControls">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={`filterButton ${filterStatus === status ? "active" : ""}`}
                onClick={() => setFilterStatus(status)}
              >
                {status === "ALL" ? "All Rooms" : humanizeStatus(status)}
              </button>
            ))}
          </div>

          <div className="tableScroller">
            <table className="roomsTable">
              <thead>
                <tr>
                  <th>Room Details</th>
                  <th>Room Type</th>
                  <th>Rate / Night</th>
                  <th>Current Status</th>
                  {!isManager && <th>Quick Actions</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="emptyState">
                      Loading room inventory...
                    </td>
                  </tr>
                ) : filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="emptyState">
                      No rooms found. Add a room to get started.
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.room_id}>
                      <td>
                        <strong>Room {room.room_number}</strong>
                        <span>ID: #{room.room_id}</span>
                      </td>
                      <td>{room.room_type}</td>
                      <td className="numericCell">
                        {formatMoney(room.price_per_night)}
                      </td>
                      <td>
                        <span className={getStatusClassName(room.status)}>
                          {humanizeStatus(room.status)}
                        </span>
                      </td>
                      {!isManager && (
                        <td>
                          <div className="actionGroup">
                            <select
                              value={room.status}
                              onChange={(e) =>
                                updateRoomStatus(
                                  room.room_id,
                                  e.target.value as RoomStatus,
                                )
                              }
                              className="statusSelect"
                            >
                              <option value="AVAILABLE">Make Available</option>
                              <option value="MAINTENANCE">Maintenance</option>
                              <option value="RESERVED" disabled>
                                Reserved
                              </option>
                              <option value="OCCUPIED" disabled>
                                Occupied
                              </option>
                            </select>
                            {isAdmin && (
                              <button
                                className="deleteBtn"
                                onClick={() => handleDeleteRoom(room.room_id)}
                              >
                                ×
                              </button>
                            )}
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

      {showModal && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <span className="eyebrow">Inventory Form</span>
                <h2>Add New Room</h2>
              </div>
              <button className="closeBtn" onClick={closeModal}>
                ×
              </button>
            </div>

            {error && <div className="errorBanner">{error}</div>}

            <form onSubmit={handleSubmit} className="roomForm">
              <label>
                Room Number
                <input
                  required
                  type="text"
                  placeholder="e.g. 101"
                  value={formData.room_number}
                  onChange={(e) =>
                    setFormData({ ...formData, room_number: e.target.value })
                  }
                />
              </label>

              <label>
                Room Type
                <select
                  value={formData.room_type}
                  onChange={(e) =>
                    setFormData({ ...formData, room_type: e.target.value })
                  }
                >
                  {roomTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Price per Night (USD)
                <input
                  required
                  type="number"
                  placeholder="150"
                  value={formData.price_per_night}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_per_night: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Initial Status
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as RoomStatus,
                    })
                  }
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </label>

              <div className="modalActions">
                <button
                  type="button"
                  className="ghostButton"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primaryButton">
                  Add Room to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

const roomStyles = `
  .roomsPage {
    max-width: 1180px;
    margin: 0 auto;
    font-family: var(--font-sans);
    font-feature-settings: "ss01";
    color: #64748d;
  }

  .roomsHero {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .roomsHero h1 {
    margin: 8px 0 12px;
    color: #061b31;
    font-size: 48px;
    font-weight: 300;
    letter-spacing: -0.96px;
    line-height: 1.08;
    max-width: 800px;
  }

  .roomsHero p {
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

  .roomsPanel {
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
  
  .searchControl {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid #e5edf5; padding: 8px 12px; border-radius: 4px;
    min-width: 300px;
  }

  .searchControl input { border: none; outline: none; flex: 1; font-size: 14px; }

  .statusControls { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .filterButton {
    background: white; border: 1px solid #e5edf5; padding: 6px 12px;
    border-radius: 4px; font-size: 13px; cursor: pointer; color: #64748d;
  }
  .filterButton.active { background: #533afd; color: white; border-color: #533afd; }

  .roomsTable { width: 100%; border-collapse: collapse; }
  .roomsTable th { text-align: left; padding: 12px; border-bottom: 1px solid #e5edf5; color: #64748d; font-size: 12px; font-weight: 500; }
  .roomsTable td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }

  .numericCell { font-variant-numeric: tabular-nums; }

  .statusBadge {
    padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 400;
  }
  .status-available { background: rgba(21, 190, 83, 0.1); color: #108c3d; border: 1px solid rgba(21, 190, 83, 0.2); }
  .status-reserved { background: rgba(83, 58, 253, 0.1); color: #533afd; border: 1px solid rgba(83, 58, 253, 0.2); }
  .status-occupied { background: rgba(50, 50, 93, 0.1); color: #061b31; border: 1px solid rgba(50, 50, 93, 0.2); }
  .status-maintenance { background: rgba(234, 34, 97, 0.1); color: #ea2261; border: 1px solid rgba(234, 34, 97, 0.2); }

  .actionGroup { display: flex; gap: 8px; align-items: center; }
  .statusSelect { border: 1px solid #e5edf5; border-radius: 4px; padding: 4px 8px; font-size: 13px; color: #475569; outline: none; }
  .deleteBtn {
    background: transparent; border: 1px solid transparent; color: #94a3b8;
    font-size: 20px; cursor: pointer; transition: color 0.15s; line-height: 1;
  }
  .deleteBtn:hover { color: #ea2261; }

  .modalOverlay {
    position: fixed; inset: 0; background: rgba(6, 27, 49, 0.5);
    display: grid; place-items: center; z-index: 1000; padding: 24px;
  }

  .modalCard {
    background: white; border-radius: 8px; width: min(480px, 100%);
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  }

  .modalHeader {
    padding: 24px; border-bottom: 1px solid #e5edf5;
    display: flex; justify-content: space-between; align-items: flex-start;
  }

  .closeBtn { background: transparent; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; }
  .errorBanner { background: #fef2f2; color: #dc2626; padding: 12px 24px; font-size: 14px; border-bottom: 1px solid #fee2e2; }

  .roomForm { padding: 24px; display: grid; gap: 16px; }
  .roomForm label { display: grid; gap: 8px; font-size: 13px; color: #475569; }
  .roomForm input, .roomForm select {
    padding: 10px 12px; border: 1px solid #e5edf5; border-radius: 4px;
    font-size: 14px; color: #0f172a; outline: none;
  }
  .roomForm input:focus { border-color: #533afd; box-shadow: 0 0 0 2px rgba(83, 58, 253, 0.1); }
  
  .modalActions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px; }

  .emptyState { text-align: center; padding: 48px !important; color: #94a3b8; }
`;

export default Rooms;
