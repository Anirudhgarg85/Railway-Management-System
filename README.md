# Railway Management System

## 1. Executive Summary & Project Introduction

Modern transport reservation platforms require reliable transaction processing, responsive user interfaces, and structured relational database storage. Legacy offline ticketing processes lead to delayed status updates, manual seat allocation errors, and inefficient passenger tracking.

The **Railway Management System** is a full-stack, modular web application designed to streamline train schedule discovery, seat reservations, and PNR status tracking. Built using Node.js, Express.js, and an embedded SQLite database, the system operates on a lightweight architecture featuring four distinct user interfaces. It provides asynchronous client-server communication using standard REST API endpoints, allowing users to query schedules, book tickets with automated PNR generation, and verify reservation details instantly.

---

## 2. Tools & Technologies Used

| Technology | Role & Functionality |
| --- | --- |
| **Node.js** | Asynchronous JavaScript runtime environment executing server-side business logic and request handling. |
| **Express.js** | Minimalist web application framework managing HTTP routing, RESTful API endpoints, and static file serving. |
| **SQLite3** | Embedded relational database storing persistent user credentials, train schedules, and reservation logs directly in `railway.db`. |
| **HTML5 & CSS3** | Structural semantic markup and modular styling across independent user interfaces. |
| **Vanilla JavaScript (Fetch API)** | Asynchronous client-side logic bridging frontend user inputs to backend REST endpoints without full page reloads. |

---

## 3. System Setup & Installation

### Prerequisites

* Node.js (v14.0.0 or higher) installed on your system.

### Step-by-Step Installation

1. **Clone the Repository & Navigate to Directory:**
```cmd
git clone https://github.com/Anirudhgarg85/Railway-Management-System.git
cd Railway-Management-System

```


2. **Install Required Node.js Packages:**
```cmd
npm install express sqlite3

```


3. **Initialize the Database & Launch Server:**
```cmd
node server.js

```


*(The server will initialize `railway.db`, create default tables, seed initial train records, and listen on `http://localhost:3000`).*
4. **Access the Web Interfaces:**
Open your browser and navigate to:
```text
http://localhost:3000/login.html

```



---

## 4. Architecture & Modular System Design

The system separates backend database operations, API route controllers, and distinct frontend views into independent modules:

```text
[Frontend Interfaces]                  [Backend API Engine]                 [Database Layer]
┌───────────────────┐                  ┌───────────────────┐               ┌──────────────────┐
│  login.html       │                  │                   │               │                  │
│  trains.html      │ ── Fetch API ──> │    server.js      │ ── SQLite ──> │   database.js    │
│  book.html        │ <── JSON Res ──  │  (Express Engine) │ <── Query ─── │   (railway.db)   │
│  tickets.html     │                  │                   │               │                  │
└───────────────────┘                  └───────────────────┘               └──────────────────┘

```

1. **Database Bootstrapping (`database.js`):** On launch, SQLite checks for missing tables (`users`, `trains`, `bookings`) and automatically seeds default admin login credentials and sample train routes.
2. **User Authentication Interface (`login.html`):** Sends user credentials to `POST /api/login` for validation before redirecting to active modules.
3. **Train Schedule Lookup (`trains.html`):** Executes `GET /api/trains` to populate available routes, travel times, and fare prices dynamically.
4. **Ticket Reservation Workflow (`book.html`):** Ingests passenger names and target train details via `POST /api/book`, generating a unique 5-digit PNR and assigned coach seat.
5. **PNR Status Verification (`tickets.html`):** Queries `GET /api/pnr/:id` to retrieve real-time reservation and seat assignment details.

---

## 5. Technical Deep-Dive & Interview Q&A

**Q1: Why was SQLite selected over traditional server-based databases like PostgreSQL or MySQL?**

* **Zero Infrastructure Overhead:** SQLite runs embedded inside the Node.js process, storing records inside a single local file (`railway.db`) without requiring external database server installations or daemon management.
* **Lightweight Transaction Processing:** Ideal for small-to-medium datasets where disk-based ACID transactions are needed without multi-server cluster complexity.

**Q2: How does `express.static()` handle multi-page routing in this project?**

* Serving the `public/` directory via `app.use(express.static(path.join(__dirname, 'public')))` allows Express to deliver independent HTML, CSS, and JS assets directly to the browser when routes like `/login.html` or `/trains.html` are requested.

**Q3: How does `database.js` prevent duplicate table creations and redundant data seeding?**

* Using `CREATE TABLE IF NOT EXISTS` combined with conditional row count queries (`SELECT COUNT(*) FROM table`) ensures SQL setup queries execute safely on every server start without overwriting existing reservation data.

**Q4: How does the application generate unique PNRs and seat assignments?**

* The backend generates randomized strings (`PNR` + 5-digit string) and coach seats (`B` + seat number 1–40) inside the `POST /api/book` controller prior to executing SQL `INSERT` commands.

**Q5: What is the advantage of using standard Vanilla JS `fetch()` instead of heavy frontend frameworks?**

* Reduces client-side bundle size to zero, eliminates build tools (like Webpack or Vite), and provides clear, beginner-friendly visibility into how HTTP requests and JSON promises bridge the UI to Node.js backend controllers.

**Q6: How does the server handle non-existent PNR queries?**

* The `GET /api/pnr/:id` endpoint executes a parameterized `SELECT` query. If no matching row returns, the server responds with `{ found: false }`, allowing the UI to display a friendly error state.

---

## 6. Future Roadmap & Developments

* **Session & Token Authentication:** Implement `express-session` or JSON Web Tokens (JWT) to persist logged-in user state across page navigations.
* **Ticket Cancellation Endpoint:** Add a `DELETE /api/pnr/:id` route to remove active bookings and free up coach seats.
* **Visual Coach Seat Selection:** Render an interactive graphical coach grid where passengers can click specific seat numbers before booking.
* **Role-Based Access Control (RBAC):** Add an Admin dashboard interface to add, edit, or cancel train schedules directly from the browser.