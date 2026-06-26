# EventSphere - MERN Event Booking System

```markdown
# EventSphere - MERN Event Booking System

A full-stack **MERN Event Booking System** where users can browse events, select seats, book tickets, and manage their bookings, while administrators can manage events, monitor bookings, and view dashboard analytics.

This project demonstrates a production-style MERN architecture using **MVC**, **Repository Pattern**, **Service Layer**, **JWT Authentication**, **Role-Based Authorization**, and **REST APIs**.

---

# 📌 Features

## 👤 User Features

- User Registration & Login
- JWT Authentication
- Protected Routes
- Browse Events
- Search Events
- Filter Events by Category
- View Event Details
- Seat Selection
- Real-time Seat Availability
- Book Tickets
- View My Bookings
- Cancel Booking
- User Profile

---

## 👨‍💼 Admin Features

- Secure Admin Login
- Create Events
- Update Event Details
- Delete Events
- Upload Event Images
- Custom Seat Pricing
- Dashboard Analytics
- Booking Statistics
- Category Occupancy
- Revenue Overview

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React Icons
- Context API

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- CORS
- Dotenv

---

# 📂 Project Structure

```

EventSphere
│
├── backend
│ ├── config
│ ├── controllers
│ ├── middleware
│ ├── models
│ ├── repositories
│ ├── routes
│ ├── services
│ ├── uploads
│ ├── utils
│ ├── app.js
│ └── server.js
│
├── frontend
│ ├── public
│ ├── src
│ │ ├── api
│ │ ├── components
│ │ ├── context
│ │ ├── hooks
│ │ ├── layouts
│ │ ├── pages
│ │ ├── routes
│ │ ├── lib
│ │ └── app
│ └── package.json

````

---

# 🏗 Architecture

The backend follows a layered architecture.

```
Client
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
MongoDB
```

### Controller
Handles HTTP Requests and Responses.

### Service
Contains Business Logic.

### Repository
Handles Database Queries.

### Model
Defines MongoDB Schema.

---

# 🔐 Authentication

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role Based Authorization

Roles:

- User
- Admin

---

# 👥 User Flow

Register

↓

Login

↓

Browse Events

↓

View Event Details

↓

Select Seats

↓

Book Tickets

↓

View Bookings

↓

Cancel Booking (if required)

---

# 👨‍💼 Admin Flow

Admin Login

↓

Dashboard

↓

Create Event

↓

Generate Seats Automatically

↓

Update Event

↓

Delete Event

↓

View Analytics

---

# 🎫 Seat Management

Every event automatically generates seats during creation.

Categories:

- Front
- Middle
- Back

Each category has:

- Seat Count
- Seat Price
- Availability Status

Example:

```
Screen

F1 F2 F3 ...

M1 M2 M3 ...

B1 B2 B3 ...
```

Seat Status:

- Available
- Reserved

---

# 💰 Seat Pricing

Each category has separate pricing.

Example:

| Category | Price |
|----------|------:|
| Front | ₹3000 |
| Middle | ₹2000 |
| Back | ₹1000 |

Admin can update pricing later.

Booked seats remain unchanged.

Only available seats receive new prices.

---

# 🎯 Event Categories

- Music
- Sports
- Theatre
- Conference
- Comedy
- Festival
- Other

---

# 📊 Dashboard Analytics

Admin Dashboard shows:

- Total Users
- Total Events
- Total Bookings
- Revenue
- Bookings per Event
- Category Occupancy

---

# 🔎 Event Search & Filters

Users can:

- Search by Title
- Filter by Category
- Filter by Status
- Sort Events
- Pagination Support

---

# 🖼 Event Images

Supports:

- Direct Image URLs
- Uploaded Images

Image preview available while creating/editing events.

---

# 🔒 Security Features

- JWT Authentication
- Password Encryption
- Protected Routes
- Role Based Authorization
- Input Validation
- Error Handling
- Environment Variables
- CORS Protection

---

# 🌐 REST APIs

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/profile |

---

## Events

| Method | Endpoint |
|---------|----------|
| GET | /api/events |
| GET | /api/events/:id |
| POST | /api/events |
| PUT | /api/events/:id |
| DELETE | /api/events/:id |

---

## Bookings

| Method | Endpoint |
|---------|----------|
| POST | /api/bookings |
| GET | /api/bookings/my |
| DELETE | /api/bookings/:id |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /api/admin/dashboard |

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/eventsphere.git

cd eventsphere
````

---

## Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run Frontend

```bash
npm run dev
```

---

# 🧪 Default Workflow

### Admin

* Login
* Create Event
* Set Seat Counts
* Set Prices
* Publish Event

### User

* Register
* Login
* Browse Events
* Select Seats
* Book Tickets
* View Bookings

---

# 📸 Screenshots

You can add screenshots here.

Examples:

* Login Page
* Register Page
* Home Page
* Event Details
* Seat Selection
* Booking Page
* User Dashboard
* Admin Dashboard
* Create Event
* Edit Event

---

# 🚀 Future Improvements

* Payment Gateway (Stripe/Razorpay)
* Email Notifications
* QR Code Tickets
* Live Seat Locking
* Wishlist
* Ratings & Reviews
* Google OAuth
* Event Recommendations
* Event Reports (PDF)
* Admin Activity Logs
* Refund System
* Multi-language Support

---

# 📚 Concepts Used

* MERN Stack
* REST API
* MVC Architecture
* Repository Pattern
* Service Layer
* JWT Authentication
* Role-Based Authorization
* MongoDB Relationships
* Embedded Documents
* CRUD Operations
* React Context API
* Protected Routes
* Axios
* File Upload
* Pagination
* Filtering
* Search
* Dashboard Analytics

---

# 👩‍💻 Author

**Vanshika Varshney**

GitHub: [https://github.com/yourusername](https://github.com/yourusername)

LinkedIn: [https://linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

# 📄 License

This project is created for educational and learning purposes.

---



```

### A couple of improvements before uploading to GitHub:
- Replace `yourusername` with your actual GitHub username.
- Replace the LinkedIn URL with your profile.
- Add 6–10 screenshots in a `screenshots/` folder and reference them in the README.
- If your project is deployed, add **Live Demo** links near the top for the frontend and backend API.

This README is suitable for a final-year major project and is comprehensive enough for recruiters and GitHub visitors.
```
