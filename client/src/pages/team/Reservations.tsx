import { useMemo, useState } from "react";
import Layout from "../../components/Layout";

type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT";

type RoomStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED" | "MAINTENANCE";

type Reservation = {
  reservation_id: number;
  guest_name: string;
  phone: string;
  email: string;
  room_number: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  booking_date: string;
  status: ReservationStatus;
  price_per_night: number;
};

type Guest = {
  guest_id: number;
  full_name: string;
  email: string;
  phone: string;
};

type Room = {
  room_id: number;
  room_number: string;
  room_type: string;
  status: RoomStatus;
  price_per_night: number;
};

type FormData = {
  guest_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  status: ReservationStatus;
};

const statusOptions: Array<ReservationStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
];

const mockReservations: Reservation[] = [
  {
    reservation_id: 1008,
    guest_name: "John Smith",
    phone: "+1 555-0101",
    email: "john@example.com",
    room_number: "101",
    room_type: "Standard",
    check_in_date: "2026-05-01",
    check_out_date: "2026-05-03",
    booking_date: "2026-04-19",
    status: "CONFIRMED",
    price_per_night: 150,
  },
  {
    reservation_id: 1009,
    guest_name: "Sarah Johnson",
    phone: "+1 555-0102",
    email: "sarah@example.com",
    room_number: "205",
    room_type: "Deluxe",
    check_in_date: "2026-05-02",
    check_out_date: "2026-05-05",
    booking_date: "2026-04-21",
    status: "PENDING",
    price_per_night: 280,
  },
  {
    reservation_id: 1010,
    guest_name: "Michael Brown",
    phone: "+1 555-0103",
    email: "michael@example.com",
    room_number: "302",
    room_type: "Suite",
    check_in_date: "2026-04-28",
    check_out_date: "2026-05-01",
    booking_date: "2026-04-12",
    status: "CHECKED_IN",
    price_per_night: 450,
  },
  {
    reservation_id: 1011,
    guest_name: "Emily Davis",
    phone: "+1 555-0104",
    email: "emily@example.com",
    room_number: "108",
    room_type: "Standard",
    check_in_date: "2026-04-25",
    check_out_date: "2026-04-28",
    booking_date: "2026-04-08",
    status: "CHECKED_OUT",
    price_per_night: 180,
  },
  {
    reservation_id: 1012,
    guest_name: "David Wilson",
    phone: "+1 555-0105",
    email: "david@example.com",
    room_number: "401",
    room_type: "Presidential",
    check_in_date: "2026-05-10",
    check_out_date: "2026-05-15",
    booking_date: "2026-04-25",
    status: "CANCELLED",
    price_per_night: 750,
  },
  {
    reservation_id: 1013,
    guest_name: "Ava Martinez",
    phone: "+1 555-0106",
    email: "ava@example.com",
    room_number: "210",
    room_type: "Deluxe",
    check_in_date: "2026-05-06",
    check_out_date: "2026-05-09",
    booking_date: "2026-04-27",
    status: "CONFIRMED",
    price_per_night: 260,
  },
];

const mockGuests: Guest[] = [
  { guest_id: 1, full_name: "John Smith", email: "john@example.com", phone: "+1 555-0101" },
  { guest_id: 2, full_name: "Sarah Johnson", email: "sarah@example.com", phone: "+1 555-0102" },
  { guest_id: 3, full_name: "Michael Brown", email: "michael@example.com", phone: "+1 555-0103" },
  { guest_id: 4, full_name: "Emily Davis", email: "emily@example.com", phone: "+1 555-0104" },
  { guest_id: 5, full_name: "David Wilson", email: "david@example.com", phone: "+1 555-0105" },
  { guest_id: 6, full_name: "Ava Martinez", email: "ava@example.com", phone: "+1 555-0106" },
];

const mockRooms: Room[] = [
  { room_id: 1, room_number: "101", room_type: "Standard", status: "AVAILABLE", price_per_night: 150 },
  { room_id: 2, room_number: "108", room_type: "Standard", status: "AVAILABLE", price_per_night: 180 },
  { room_id: 3, room_number: "205", room_type: "Deluxe", status: "AVAILABLE", price_per_night: 280 },
  { room_id: 4, room_number: "210", room_type: "Deluxe", status: "RESERVED", price_per_night: 260 },
  { room_id: 5, room_number: "302", room_type: "Suite", status: "OCCUPIED", price_per_night: 450 },
  { room_id: 6, room_number: "401", room_type: "Presidential", status: "RESERVED", price_per_night: 750 },
  { room_id: 7, room_number: "118", room_type: "Standard", status: "MAINTENANCE", price_per_night: 175 },
];

const emptyForm: FormData = {
  guest_id: "",
  room_id: "",
  check_in_date: "",
  check_out_date: "",
  status: "PENDING",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const getNights = (checkIn: string, checkOut: string) =>
  Math.max(
    1,
    Math.ceil(
      (new Date(`${checkOut}T00:00:00`).getTime() -
        new Date(`${checkIn}T00:00:00`).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

const humanizeStatus = (status: string) =>
  status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");

const getStatusClassName = (status: ReservationStatus | RoomStatus) =>
  `statusBadge status-${status.toLowerCase().replace("_", "-")}`;

const Reservations = () => {
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const filteredReservations = useMemo(
    () =>
      mockReservations.filter((reservation) => {
        const matchesStatus =
          filterStatus === "ALL" || reservation.status === filterStatus;
        const searchable = [
          reservation.reservation_id,
          reservation.guest_name,
          reservation.room_number,
          reservation.room_type,
          reservation.status,
        ]
          .join(" ")
          .toLowerCase();

        return matchesStatus && searchable.includes(searchTerm.toLowerCase());
      }),
    [filterStatus, searchTerm],
  );

  const metrics = useMemo(() => {
    const activeReservations = mockReservations.filter(
      (reservation) =>
        reservation.status === "CONFIRMED" || reservation.status === "CHECKED_IN",
    );
    const expectedRevenue = activeReservations.reduce(
      (total, reservation) =>
        total +
        reservation.price_per_night *
          getNights(reservation.check_in_date, reservation.check_out_date),
      0,
    );
    const arrivalsToday = mockReservations.filter(
      (reservation) => reservation.check_in_date === "2026-05-01",
    ).length;
    const availableRooms = mockRooms.filter((room) => room.status === "AVAILABLE").length;

    return [
      { label: "Active reservations", value: activeReservations.length.toString(), detail: "Confirmed and in-house" },
      { label: "Expected revenue", value: formatMoney(expectedRevenue), detail: "From active stays" },
      { label: "Arrivals today", value: arrivalsToday.toString(), detail: "May 1 operational queue" },
      { label: "Available rooms", value: availableRooms.toString(), detail: "Ready for assignment" },
    ];
  }, []);

  const selectedRoom = mockRooms.find((room) => room.room_id.toString() === formData.room_id);
  const projectedNights =
    formData.check_in_date && formData.check_out_date
      ? getNights(formData.check_in_date, formData.check_out_date)
      : 0;
  const projectedTotal = selectedRoom ? selectedRoom.price_per_night * projectedNights : 0;

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyForm);
  };

  return (
    <Layout>
      <style>{reservationStyles}</style>
      <div className="reservationsPage">
        <section className="reservationsHero">
          <div>
            <span className="eyebrow">Reservations Engine</span>
            <h1>Bookings, room assignment, and stay status in one workspace.</h1>
            <p>
              A schema-aligned control surface for reception teams to review
              reservation flow, guest details, room readiness, and upcoming stays.
            </p>
          </div>
          <div className="heroActions">
            <button className="ghostButton" type="button">
              Export Manifest
            </button>
            <button className="primaryButton" type="button" onClick={() => setShowModal(true)}>
              New Reservation
            </button>
          </div>
        </section>

        <section className="metricGrid" aria-label="Reservation summary">
          {metrics.map((metric) => (
            <article className="metricCard" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="workspaceGrid">
          <div className="reservationPanel">
            <div className="panelHeader">
              <div>
                <h2>Reservation Queue</h2>
                <p>{filteredReservations.length} records matched</p>
              </div>
              <div className="searchControl">
                <span aria-hidden="true">Search</span>
                <input
                  aria-label="Search reservations"
                  type="search"
                  placeholder="Guest, room, status, ID"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="statusControls" aria-label="Reservation status filters">
              {statusOptions.map((status) => (
                <button
                  className={filterStatus === status ? "filterButton active" : "filterButton"}
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                >
                  {status === "ALL" ? "All" : humanizeStatus(status)}
                </button>
              ))}
            </div>

            <div className="tableScroller">
              <table className="reservationsTable">
                <thead>
                  <tr>
                    <th>Reservation</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Nights</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => {
                    const nights = getNights(
                      reservation.check_in_date,
                      reservation.check_out_date,
                    );
                    const total = reservation.price_per_night * nights;

                    return (
                      <tr key={reservation.reservation_id}>
                        <td>
                          <strong>#{reservation.reservation_id}</strong>
                          <span>Booked {formatDate(reservation.booking_date)}</span>
                        </td>
                        <td>
                          <strong>{reservation.guest_name}</strong>
                          <span>{reservation.phone}</span>
                        </td>
                        <td>
                          <strong>{reservation.room_number}</strong>
                          <span>{reservation.room_type}</span>
                        </td>
                        <td>
                          <strong>{formatDate(reservation.check_in_date)}</strong>
                          <span>to {formatDate(reservation.check_out_date)}</span>
                        </td>
                        <td className="numericCell">{nights}</td>
                        <td className="numericCell">{formatMoney(total)}</td>
                        <td>
                          <span className={getStatusClassName(reservation.status)}>
                            {humanizeStatus(reservation.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="sideStack" aria-label="Room availability and actions">
            <section className="availabilityCard">
              <div className="panelHeader compact">
                <div>
                  <h2>Room Availability</h2>
                  <p>Live assignment model</p>
                </div>
              </div>
              <div className="roomList">
                {mockRooms.map((room) => (
                  <div className="roomItem" key={room.room_id}>
                    <div>
                      <strong>Room {room.room_number}</strong>
                      <span>{room.room_type}</span>
                    </div>
                    <div>
                      <span className={getStatusClassName(room.status)}>
                        {humanizeStatus(room.status)}
                      </span>
                      <small>{formatMoney(room.price_per_night)}/night</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="workflowCard">
              <span className="eyebrow">Operational Path</span>
              <h2>Pending to checked out</h2>
              <ol>
                <li>
                  <span>1</span>
                  <p>Capture guest, room, and stay dates.</p>
                </li>
                <li>
                  <span>2</span>
                  <p>Confirm reservation and reserve the assigned room.</p>
                </li>
                <li>
                  <span>3</span>
                  <p>Check in, invoice services, collect payment, and release room.</p>
                </li>
              </ol>
            </section>
          </aside>
        </section>

        {showModal && (
          <div className="modalOverlay" role="presentation" onClick={closeModal}>
            <div
              aria-modal="true"
              className="reservationModal"
              role="dialog"
              aria-labelledby="reservation-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modalHeader">
                <div>
                  <span className="eyebrow">Create Booking</span>
                  <h2 id="reservation-modal-title">New Reservation</h2>
                </div>
                <button
                  aria-label="Close reservation form"
                  className="iconButton"
                  type="button"
                  onClick={closeModal}
                >
                  x
                </button>
              </div>

              <form
                className="reservationForm"
                onSubmit={(event) => {
                  event.preventDefault();
                  closeModal();
                }}
              >
                <label>
                  Guest
                  <select
                    value={formData.guest_id}
                    onChange={(event) => updateForm("guest_id", event.target.value)}
                  >
                    <option value="">Select guest profile</option>
                    {mockGuests.map((guest) => (
                      <option key={guest.guest_id} value={guest.guest_id}>
                        {guest.full_name} - {guest.phone}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Room
                  <select
                    value={formData.room_id}
                    onChange={(event) => updateForm("room_id", event.target.value)}
                  >
                    <option value="">Select available room</option>
                    {mockRooms
                      .filter((room) => room.status === "AVAILABLE")
                      .map((room) => (
                        <option key={room.room_id} value={room.room_id}>
                          {room.room_number} - {room.room_type} -{" "}
                          {formatMoney(room.price_per_night)}/night
                        </option>
                      ))}
                  </select>
                </label>

                <div className="formColumns">
                  <label>
                    Check-in
                    <input
                      type="date"
                      value={formData.check_in_date}
                      onChange={(event) => updateForm("check_in_date", event.target.value)}
                    />
                  </label>
                  <label>
                    Check-out
                    <input
                      type="date"
                      value={formData.check_out_date}
                      onChange={(event) => updateForm("check_out_date", event.target.value)}
                    />
                  </label>
                </div>

                <label>
                  Initial status
                  <select
                    value={formData.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as ReservationStatus)
                    }
                  >
                    {statusOptions
                      .filter((status) => status !== "ALL")
                      .map((status) => (
                        <option key={status} value={status}>
                          {humanizeStatus(status)}
                        </option>
                      ))}
                  </select>
                </label>

                <div className="estimateBox">
                  <span>Projected stay</span>
                  <strong>{projectedNights ? `${projectedNights} nights` : "Dates pending"}</strong>
                  <p>{projectedTotal ? formatMoney(projectedTotal) : "Select a room and dates"}</p>
                </div>

                <div className="modalActions">
                  <button className="ghostButton" type="button" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="primaryButton" type="submit">
                    Create Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const reservationStyles = `
  .reservationsPage {
    max-width: 1180px;
    margin: 0 auto;
    color: #64748d;
    font-family: var(--font-sans);
    font-feature-settings: "ss01";
  }

  .reservationsHero {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .reservationsHero h1 {
    max-width: 780px;
    margin: 8px 0 12px;
    color: #061b31;
    font-size: 48px;
    font-weight: 300;
    letter-spacing: -0.96px;
    line-height: 1.08;
  }

  .reservationsHero p {
    max-width: 710px;
    margin: 0;
    color: #64748d;
    font-size: 18px;
    font-weight: 300;
    line-height: 1.4;
  }

  .eyebrow {
    display: inline-block;
    color: #533afd;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1;
  }

  .heroActions,
  .modalActions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .primaryButton,
  .ghostButton,
  .filterButton,
  .iconButton {
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--font-sans);
    font-feature-settings: "ss01";
    font-weight: 400;
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
  }

  .primaryButton {
    border: 1px solid #533afd;
    background: #533afd;
    color: #ffffff;
    padding: 10px 16px;
    font-size: 14px;
    box-shadow: rgba(50,50,93,0.2) 0px 12px 20px -12px, rgba(0,0,0,0.08) 0px 6px 12px -8px;
  }

  .primaryButton:hover {
    background: #4434d4;
    border-color: #4434d4;
  }

  .ghostButton {
    border: 1px solid #b9b9f9;
    background: transparent;
    color: #533afd;
    padding: 10px 16px;
    font-size: 14px;
  }

  .ghostButton:hover {
    background: rgba(83,58,253,0.05);
  }

  .metricGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .metricCard,
  .reservationPanel,
  .availabilityCard,
  .workflowCard,
  .reservationModal {
    background: #ffffff;
    border: 1px solid #e5edf5;
    border-radius: 6px;
    box-shadow: rgba(50,50,93,0.18) 0px 24px 42px -28px, rgba(0,0,0,0.08) 0px 14px 26px -18px;
  }

  .metricCard {
    min-height: 132px;
    padding: 20px;
  }

  .metricCard span,
  .metricCard p,
  .panelHeader p,
  .reservationsTable span,
  .roomItem span,
  .roomItem small,
  .estimateBox span,
  .estimateBox p {
    color: #64748d;
    font-size: 13px;
    font-weight: 300;
  }

  .metricCard strong {
    display: block;
    margin: 10px 0 6px;
    color: #061b31;
    font-size: 30px;
    font-weight: 300;
    letter-spacing: -0.4px;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  .metricCard p {
    margin: 0;
  }

  .workspaceGrid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 24px;
    align-items: start;
  }

  .reservationPanel,
  .availabilityCard,
  .workflowCard {
    padding: 24px;
  }

  .panelHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 18px;
  }

  .panelHeader.compact {
    margin-bottom: 12px;
  }

  .panelHeader h2,
  .workflowCard h2,
  .modalHeader h2 {
    margin: 0;
    color: #061b31;
    font-size: 22px;
    font-weight: 300;
    letter-spacing: -0.22px;
    line-height: 1.1;
  }

  .panelHeader p {
    margin: 6px 0 0;
  }

  .searchControl {
    display: grid;
    grid-template-columns: auto minmax(180px, 1fr);
    align-items: center;
    gap: 10px;
    min-width: 300px;
    border: 1px solid #e5edf5;
    border-radius: 4px;
    background: #ffffff;
    padding: 8px 10px;
  }

  .searchControl span {
    color: #273951;
    font-size: 12px;
    font-weight: 400;
  }

  .searchControl input,
  .reservationForm input,
  .reservationForm select {
    width: 100%;
    border: 0;
    outline: 0;
    color: #061b31;
    background: #ffffff;
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 300;
  }

  .searchControl:focus-within,
  .reservationForm label:focus-within {
    border-color: #533afd;
    box-shadow: 0 0 0 2px rgba(83,58,253,0.1);
  }

  .statusControls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
  }

  .filterButton {
    border: 1px solid #e5edf5;
    background: #ffffff;
    color: #64748d;
    padding: 8px 10px;
    font-size: 13px;
  }

  .filterButton.active {
    border-color: #533afd;
    background: #533afd;
    color: #ffffff;
  }

  .tableScroller {
    overflow-x: auto;
  }

  .reservationsTable {
    width: 100%;
    min-width: 820px;
    border-collapse: collapse;
  }

  .reservationsTable th {
    padding: 12px 12px;
    border-top: 1px solid #e5edf5;
    border-bottom: 1px solid #e5edf5;
    color: #64748d;
    font-size: 12px;
    font-weight: 400;
    text-align: left;
  }

  .reservationsTable td {
    padding: 16px 12px;
    border-bottom: 1px solid #e5edf5;
    color: #061b31;
    font-size: 14px;
    vertical-align: middle;
  }

  .reservationsTable td strong,
  .roomItem strong {
    display: block;
    color: #061b31;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.25;
  }

  .reservationsTable td span,
  .roomItem span,
  .roomItem small {
    display: block;
    margin-top: 4px;
  }

  .numericCell {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  .statusBadge {
    display: inline-flex;
    width: max-content;
    align-items: center;
    border-radius: 4px;
    padding: 3px 7px;
    font-size: 11px;
    font-weight: 400;
    line-height: 1.2;
  }

  .status-confirmed,
  .status-available {
    border: 1px solid rgba(21,190,83,0.4);
    background: rgba(21,190,83,0.14);
    color: #108c3d;
  }

  .status-pending,
  .status-reserved {
    border: 1px solid rgba(83,58,253,0.26);
    background: rgba(83,58,253,0.09);
    color: #533afd;
  }

  .status-checked-in,
  .status-occupied {
    border: 1px solid rgba(50,50,93,0.26);
    background: rgba(50,50,93,0.11);
    color: #061b31;
  }

  .status-checked-out {
    border: 1px solid rgba(100,116,141,0.24);
    background: rgba(100,116,141,0.1);
    color: #64748d;
  }

  .status-cancelled,
  .status-maintenance {
    border: 1px solid rgba(234,34,97,0.3);
    background: rgba(234,34,97,0.08);
    color: #ea2261;
  }

  .sideStack {
    display: grid;
    gap: 24px;
  }

  .roomList {
    display: grid;
    gap: 10px;
  }

  .roomItem {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    border: 1px solid #e5edf5;
    border-radius: 4px;
    padding: 12px;
  }

  .roomItem > div:last-child {
    display: grid;
    justify-items: end;
  }

  .workflowCard {
    background: #1c1e54;
    border-color: #1c1e54;
  }

  .workflowCard .eyebrow,
  .workflowCard h2 {
    color: #ffffff;
  }

  .workflowCard ol {
    display: grid;
    gap: 14px;
    margin: 18px 0 0;
    padding: 0;
    list-style: none;
  }

  .workflowCard li {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 12px;
    align-items: start;
  }

  .workflowCard li span {
    display: grid;
    width: 28px;
    height: 28px;
    place-items: center;
    border: 1px solid rgba(255,255,255,0.22);
    border-radius: 4px;
    color: #ffffff;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  .workflowCard p {
    margin: 2px 0 0;
    color: rgba(255,255,255,0.72);
    font-size: 14px;
    font-weight: 300;
    line-height: 1.4;
  }

  .modalOverlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(6,27,49,0.48);
  }

  .reservationModal {
    width: min(560px, 100%);
    max-height: 92vh;
    overflow: auto;
    box-shadow: rgba(3,3,39,0.25) 0px 14px 21px -14px, rgba(0,0,0,0.1) 0px 8px 17px -8px;
  }

  .modalHeader {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    border-bottom: 1px solid #e5edf5;
    padding: 22px 24px;
  }

  .iconButton {
    width: 32px;
    height: 32px;
    border: 1px solid #e5edf5;
    background: #ffffff;
    color: #64748d;
    font-size: 16px;
    line-height: 1;
  }

  .iconButton:hover {
    color: #533afd;
    border-color: #b9b9f9;
  }

  .reservationForm {
    display: grid;
    gap: 16px;
    padding: 24px;
  }

  .reservationForm label {
    display: grid;
    gap: 8px;
    border: 1px solid #e5edf5;
    border-radius: 4px;
    padding: 10px 12px;
    color: #273951;
    font-size: 13px;
    font-weight: 400;
  }

  .formColumns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .estimateBox {
    border: 1px dashed #362baa;
    border-radius: 4px;
    background: rgba(83,58,253,0.04);
    padding: 14px;
  }

  .estimateBox strong {
    display: block;
    margin: 6px 0 2px;
    color: #061b31;
    font-size: 22px;
    font-weight: 300;
    letter-spacing: -0.22px;
  }

  .estimateBox p {
    margin: 0;
  }

  @media (max-width: 1100px) {
    .workspaceGrid {
      grid-template-columns: 1fr;
    }

    .sideStack {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 860px) {
    .reservationsHero,
    .panelHeader {
      display: grid;
    }

    .reservationsHero h1 {
      font-size: 34px;
      letter-spacing: -0.64px;
    }

    .heroActions,
    .searchControl {
      width: 100%;
    }

    .metricGrid,
    .sideStack {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 620px) {
    .reservationsPage {
      margin: -16px;
    }

    .reservationPanel,
    .availabilityCard,
    .workflowCard,
    .metricCard {
      padding: 18px;
    }

    .formColumns {
      grid-template-columns: 1fr;
    }

    .primaryButton,
    .ghostButton {
      width: 100%;
      justify-content: center;
    }
  }
`;

export default Reservations;
