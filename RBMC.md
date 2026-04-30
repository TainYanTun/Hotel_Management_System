# Role-Based Access Control (RBAC)

| Feature / Module            | Administrator | Receptionist | Manager | Finance Officer |
|---------------------------|--------------|--------------|---------|-----------------|
| User Management           | ✔ Full Access | ✖            | ✖       | ✖               |
| Room Management           | ✔ Full Access | ✔ Update Status | View Only | ✖           |
| Reservation Management    | ✔            | ✔ Full Access | View Only | ✖              |
| Guest Management          | ✔            | ✔            | View Only | ✖              |
| Check-In / Check-Out      | ✔            | ✔ Full Access | ✖       | ✖               |
| Billing & Invoice         | ✔            | ✔            | View Only | ✔ Full Access   |
| Payment Processing        | ✔            | ✔            | ✖       | ✔ Full Access   |
| Reports & Analytics       | ✔            | ✖            | ✔ Full Access | ✔            |
| System Settings           | ✔ Full Access | ✖            | ✖       | ✖               |
| Audit Logs                | ✔            | ✖            | ✔ View   | ✔ View          |

