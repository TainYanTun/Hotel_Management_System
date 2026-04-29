-- =========================
-- ENUM TYPES
-- =========================

CREATE TYPE user_role AS ENUM ('ADMIN', 'RECEPTIONIST', 'MANAGER', 'FINANCE');

CREATE TYPE room_status AS ENUM ('AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE');

CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT');

CREATE TYPE payment_method AS ENUM ('CASH', 'CARD', 'TRANSFER');

CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED');


-- =========================
-- USERS (RBAC)
-- =========================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- GUESTS (PDPA sensitive)
-- =========================

CREATE TABLE guests (
    guest_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    id_passport VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- ROOMS
-- =========================

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type VARCHAR(50),
    price_per_night DECIMAL(10,2) NOT NULL,
    status room_status DEFAULT 'AVAILABLE'
);


-- =========================
-- RESERVATIONS
-- =========================

CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    guest_id INT REFERENCES guests(guest_id) ON DELETE CASCADE,
    room_id INT REFERENCES rooms(room_id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status reservation_status DEFAULT 'PENDING'
);


-- =========================
-- CHECK-IN RECORD
-- =========================

CREATE TABLE checkins (
    checkin_id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    checkin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- SERVICES
-- =========================

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(100),
    service_cost DECIMAL(10,2) NOT NULL
);


-- =========================
-- INVOICES
-- =========================

CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(reservation_id),
    total_amount DECIMAL(10,2),
    payment_status payment_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- INVOICE SERVICES (M:N)
-- =========================

CREATE TABLE invoice_services (
    invoice_service_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    service_id INT REFERENCES services(service_id),
    quantity INT DEFAULT 1
);


-- =========================
-- PAYMENTS
-- =========================

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    method payment_method,
    amount DECIMAL(10,2),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- AUDIT LOG (NON-REPUDIATION)
-- =========================

CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    action TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);


-- =========================
-- INDEXES (PERFORMANCE <1.5s)
-- =========================

CREATE INDEX idx_reservation_guest ON reservations(guest_id);
CREATE INDEX idx_reservation_room ON reservations(room_id);
CREATE INDEX idx_room_status ON rooms(status);
CREATE INDEX idx_invoice_reservation ON invoices(reservation_id);
CREATE INDEX idx_payment_invoice ON payments(invoice_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);


-- =========================
-- DATA INTEGRITY CONSTRAINTS
-- =========================

ALTER TABLE reservations
ADD CONSTRAINT check_dates CHECK (check_out_date > check_in_date);


-- =========================
-- SAMPLE TRIGGER: AUTO ROOM STATUS
-- =========================

CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'CONFIRMED' THEN
        UPDATE rooms SET status = 'RESERVED' WHERE room_id = NEW.room_id;
    ELSIF NEW.status = 'CHECKED_IN' THEN
        UPDATE rooms SET status = 'OCCUPIED' WHERE room_id = NEW.room_id;
    ELSIF NEW.status = 'CHECKED_OUT' THEN
        UPDATE rooms SET status = 'AVAILABLE' WHERE room_id = NEW.room_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_room_status
AFTER UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_room_status();