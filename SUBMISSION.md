# **Project Report 3 — Construction, Verification, and Technical Stewardship**

**Course:** IT368 Software Engineering
**Unit:** 6 – Software Construction, SQA, and Testing Mastery
**Project:** Hotel Management System
**Team:** Su Man (PM), Tain Yan Tun (Architect), Siwaporn (Lead Dev), Thuta Naing (QA), Wisa (BA)

---

# **1. Executive Summary**

Report 3 represents the transition from architectural design to a fully functioning system. In this phase, the team demonstrates **Technical Stewardship** through disciplined software construction, structured collaboration, and rigorous verification.

The objective of this report is to provide evidence that the implementation aligns with the architectural blueprint established in Report 2. This includes documentation of **Software Configuration Management (SCM)** practices, **collaborative development strategies**, **Software Quality Assurance (SQA) metrics**, and **comprehensive testing results**.

Through the application of structured engineering practices such as version control, pair programming, clean code principles, and formal testing, the team ensures that the Hotel Management System is robust, maintainable, and aligned with its design objectives.

---

# **2. Section 1: Software Configuration Management (SCM) & Tracking**

## **2.1 Version Control Strategy (VCS Evidence)**

The team adopted a **Feature Branch Workflow** using GitHub:

* `main` → stable production-ready branch
* `feature/*` → individual development tasks
* `bugfix/*` → defect resolution
* `hotfix/*` → urgent fixes

All features were developed in isolated branches and merged into `main` only after review.

📌 *[Insert GitHub Network Graph Screenshot]*

---

## **2.2 Pull Request (PR) Audit**

The team enforced **formal Pull Request reviews** before merging.

### Example PRs:

1. **PR #12 — Reservation Module Implementation**
2. **PR #18 — RBAC Authentication System**
3. **PR #23 — Billing & Invoice Logic**

Each PR included:

* Code review comments from the Navigator/Reviewer
* Requested changes before approval
* Final approval before merge

📌 *[Insert PR Review Screenshot]*

---

## **2.3 Issue Tracking**

The team used **GitHub Projects / Issues Board** to track tasks.

### Workflow:

* To Do → In Progress → Review → Closed

### Example Tasks:

* Implement reservation logic
* Design database schema
* Build authentication module
* Create invoice generation
* Write unit tests

📌 *[Insert Issue Board Screenshot]*

---

# **3. Section 2: Hybrid Implementation & Collaborative Construction**

## **3.1 Hybrid Pair Programming & AI Oversight**

### **Session 1: Reservation Logic Implementation**

* **Driver:** Siwaporn (Lead Developer)
* **Navigator:** Tain Yan Tun (Architect)
* **AI Role:** Used for logic scaffolding

**Prompt Example:**

> "Generate reservation validation logic ensuring no overlapping bookings for the same room."

**Navigator Oversight:**

* Verified time conflict logic
* Added edge-case handling (same-day checkout/check-in)
* Improved performance with indexed queries

---

### **Session 2: Billing System Calculation**

* **Driver:** Siwaporn
* **Navigator:** Thuta Naing (QA Lead)

**AI Prompt:**

> "Create a function to calculate total invoice including services and taxes."

**Navigator Actions:**

* Validated correctness of calculation
* Added rounding control for currency
* Ensured compliance with financial accuracy

---

## **3.2 Clean Code Application**

### **Example 1 — SOLID Principle (SRP)**

**Before (Violation of SRP):**

```java
class InvoiceService {
    void processInvoice() {
        calculateTotal();
        saveToDatabase();
        sendEmail();
    }
}
```

**After (SRP Applied):**

```java
class InvoiceCalculator {
    double calculateTotal() { }
}

class InvoiceRepository {
    void save() { }
}

class NotificationService {
    void sendEmail() { }
}
```

---

### **Example 2 — Removing Magic Numbers & Using Guard Clauses**

**Before:**

```java
if (days > 0) {
    total = days * 1000;
}
```

**After:**

```java
private static final int ROOM_PRICE = 1000;

if (days <= 0) return 0;

total = days * ROOM_PRICE;
```

---

# **4. Section 3: Software Quality Assurance (SQA) & Review Metrics**

## **4.1 Metrics Audit**

| Module                | Fan-In | Fan-Out | V(G) | LCOM   |
| --------------------- | ------ | ------- | ---- | ------ |
| Reservation Module    | 5      | 6       | 7    | Low    |
| Billing Module        | 4      | 5       | 6    | Low    |
| Authentication Module | 6      | 7       | 8    | Medium |

✅ All modules satisfy:

* Fan-Out ≤ 7
* Cyclomatic Complexity < 10

---

## **4.2 Formal Technical Review (FTR)**

### **Issue Log**

* Missing validation in reservation dates
* Incorrect tax calculation edge case
* Unauthorized access to admin route

### **Resolution**

* Added input validation
* Fixed rounding logic
* Implemented RBAC middleware

### **Final Decision**

✅ **ACCEPTED (after rework)**

---

# **5. Section 4: Verification and Validation — Testing Results**

## **5.1 Unit Testing Suite**

### **Happy Path**

* Booking a valid reservation
* Generating invoice correctly

### **Boundary Cases**

* Check-in date = check-out date
* Maximum room capacity

### **Negative Cases**

* Invalid email input
* Booking unavailable room

---

### **Example Test Case**

```java
@Test
void testReservationSuccess() {
    assertTrue(reservationService.bookRoom(validData));
}
```

---

## **5.2 Defensive Resilience**

### **Code Example**

```java
if (dbConnection == null) {
    throw new SystemException("Unable to connect to database. Please try again.");
}
```

### **User Message**

> "We are experiencing temporary issues. Please try again or contact support."

📌 *[Insert Screenshot of Error Message]*

---

# **6. Section 5: Risk Management & Technical Debt Audit**

## **6.1 Updated Risk Register**

| Risk                   | Mitigation                             |
| ---------------------- | -------------------------------------- |
| Performance bottleneck | Added indexing & query optimization    |
| Security vulnerability | Implemented RBAC + encryption          |
| Schedule delay         | Used buffer time & task redistribution |

---

## **6.2 Technical Debt Log**

### **Identified Debt**

* Hardcoded values in early prototype
* Limited test coverage in reporting module

### **Refactoring Plan**

* Replace hardcoded values with config constants
* Expand test coverage in next sprint
* Refactor reporting module into micro-components

---

# **7. Conclusion**

This report demonstrates that the Hotel Management System has been constructed with strong engineering discipline, validated through testing, and protected through structured quality assurance practices.

The system meets its architectural goals and is ready for deployment, with identified improvements planned for future iterations.

---
