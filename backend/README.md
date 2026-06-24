# EventSphere – Smart Event Booking System (Backend)

A complete REST API backend for an event booking platform, built with
**Node.js, Express.js, MongoDB and Mongoose**.

This project follows a simple **layered architecture** so every piece of
logic has one clear job:

```
Routes        -> defines the URL + which middleware/controller handles it
Controllers   -> reads the request, calls the service, sends the response
Services      -> the actual business logic (rules, calculations, flow)
Repositories  -> the only files that talk directly to MongoDB/Mongoose
Models        -> Mongoose schemas (shape of the data)
Middleware    -> auth, role checks, file upload, error handling
Validators    -> checks request data before it reaches the controller
Utils         -> small reusable helpers (seat generator, JWT, query features)
```

Request flow for every API call:

```
Client -> Route -> Middleware (auth/validation) -> Controller -> Service -> Repository -> MongoDB
                                                                                            |
Client <----------------------------------- JSON Response <-------------------------------
```

---

## 1. Setup

```bash
npm install
cp .env.example .env   # then fill in your real values
npm run dev             # starts with nodemon
# or
npm start
```

Make sure MongoDB is running locally, or use a MongoDB Atlas connection
string in `MONGO_URI`.

---

## 2. Roles

There are only **2 roles**: `user` and `admin`. There is no Super Admin.
A user becomes an admin simply by passing `"role": "admin"` during
registration (in a real production app this would be restricted, but for
this training project it's kept simple).

---

## 3. Authentication

All protected routes require a header:

```
Authorization: Bearer <token>
```

The token is returned by `/register` and `/login`.

| Method | Endpoint              | Access  | Description              |
|--------|------------------------|---------|---------------------------|
| POST   | /api/auth/register     | Public  | Register a new user      |
| POST   | /api/auth/login        | Public  | Login and get a JWT       |
| POST   | /api/auth/logout        | Private | Logout (stateless)        |
| GET    | /api/auth/me            | Private | Get logged-in user profile|

**Register Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

**Login Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

## 4. Events

| Method | Endpoint            | Access      | Description                                   |
|--------|----------------------|-------------|------------------------------------------------|
| GET    | /api/events           | Public      | List events (search/filter/sort/paginate)       |
| GET    | /api/events/:id        | Public      | Get a single event (includes seat map)          |
| POST   | /api/events            | Admin only  | Create event (multipart form, field `image`)    |
| PUT    | /api/events/:id        | Admin only  | Update event                                     |
| DELETE | /api/events/:id        | Admin only  | Delete event                                     |

**Query params on `GET /api/events`**
```
?search=tech          -> partial match on title
&category=Workshop     -> exact match
&status=Upcoming        -> exact match
&date=2026-08-01         -> exact match
&page=1&limit=10          -> pagination
&sort=date or -date        -> ascending / descending
```

**Create Event Body** (multipart/form-data)
```
title:        "Tech Summit 2026"
description:  "A full day tech conference"
venue:        "Delhi Convention Center"
date:         "2026-08-01"
category:     "Conference"
price:        500
image:        <file>   (optional, sent as form-data file)
```

When an event is created, **100 seats are auto-generated**:
`F1-F20` (Front), `M1-M30` (Middle), `B1-B50` (Back) - all starting as
`"Available"`.

---

## 5. Bookings

| Method | Endpoint            | Access  | Description                         |
|--------|-----------------------|---------|---------------------------------------|
| POST   | /api/bookings           | Private | Book one or more seats for an event   |
| GET    | /api/bookings/my         | Private | Get the logged-in user's bookings     |
| DELETE | /api/bookings/:id         | Private | Cancel a booking & release seats      |

**Create Booking Body**
```json
{
  "eventId": "64f...",
  "seats": ["F1", "F2"]
}
```

**Booking Flow**
```
Select Seats -> Validate Seats Exist -> Check Availability ->
Create Booking -> Reserve Seats -> Generate QR -> Send Email -> Respond
```

If even one requested seat is already `Reserved`, the **entire** booking is
rejected with `409 Conflict` and no seats are touched:
```json
{ "success": false, "message": "Seat already booked: F1" }
```

**Cancellation Flow**
```
Cancel Booking -> Update bookingStatus to "Cancelled" ->
Release seats back to "Available" -> Send cancellation email
```

---

## 6. Admin Dashboard

| Method | Endpoint              | Access     | Description                |
|--------|------------------------|------------|------------------------------|
| GET    | /api/admin/dashboard     | Admin only | Aggregated analytics         |

Response includes:
```json
{
  "totalUsers": 0,
  "totalEvents": 0,
  "totalBookings": 0,
  "revenue": 0,
  "occupancyPercentage": 0,
  "bookingsPerEvent": [],
  "categoryOccupancy": []
}
```

All numbers are calculated using MongoDB's **Aggregation Pipeline**
(`Booking.aggregate()`, `Event.aggregate()`), not by loading every
document into Node and looping manually.

---

## 7. Standard Response Format

**Success**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 8. Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcrypt for auth
- Multer + Cloudinary for image upload
- express-validator for request validation
- qrcode for generating booking QR codes
- nodemailer for booking/cancellation emails

No microservices, no Socket.io, no Redis, no payment gateway, no
TypeScript, no GraphQL - kept intentionally simple so every file can be
explained line-by-line in an interview or project demo.
