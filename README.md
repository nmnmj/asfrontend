# Collaborative Task Manager – Frontend

This repository contains the **frontend application** for the **Collaborative Task Manager**.

It is a **production-ready React application** built with **TypeScript**, featuring **real-time updates**, **JWT-based authentication**, and **modern state management**.

---

## Tech Stack (Frontend)

* **React (Vite)**
* **TypeScript**
* **Tailwind CSS**
* **TanStack Query (React Query)** – server state & caching
* **Socket.io Client** – real-time updates
* **React Hook Form + Zod** – form handling & validation
* **React Router** – routing
* **React Toastify** – user feedback & notifications

---

## Project Setup

### Prerequisites

* **Node.js ≥ 18**
* **Backend running locally** (see backend repository)

---

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

---

### 3️⃣ Run Frontend Locally

```bash
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---

## Authentication Flow (Frontend)

Authentication is handled using **JWT (JSON Web Token)**.

### Key Characteristics

* JWT is returned by backend on **login / register**
* JWT is stored **in memory** using **React Context**
* JWT is attached to every HTTP request via:

```http
Authorization: Bearer <JWT>
```

* JWT is also used to authenticate **Socket.io connections**
* **No cookies** are used for authentication

---

### On App Load

* JWT (if present) is automatically applied to Axios
* `/api/users/me` is called to hydrate user state
* Protected routes are enforced via `ProtectedRoute`
* Socket connection is established **only after JWT is available**

---

## API Contract (Frontend Perspective)

### User APIs

* `GET /api/users/me` – fetch logged-in user
* `PUT /api/users/me` – update profile
* `GET /api/users/all` – list users (task assignment)

### Task APIs

* `GET /api/tasks`
* `GET /api/tasks/:id`
* `POST /api/tasks`
* `PUT /api/tasks/:id`
* `DELETE /api/tasks/:id`

### Notification APIs

* `GET /api/notifications`
* `PATCH /api/notifications/:id/read`

---

## Real-Time Functionality (Socket.io)

### How Socket.io Is Used (Frontend)

* Socket is initialized **once globally**
* JWT is sent during socket handshake:

```ts
auth: { token: "Bearer <JWT>" }
```

* Backend authenticates socket and automatically joins the user’s **private room**
* Frontend **never emits join events**

---

### Events Listened To

* `task:created`
* `task:updated`
* `task:deleted`
* `notification:new`

---

### Effects on UI

* **Task events** → TanStack Query cache invalidation
* **Notification events** → appended to notification context
* **No polling required**

---

## Task Synchronization Strategy

### With Socket.io

* Socket events trigger query invalidation
* UI updates instantly across all connected clients

### Without Socket.io (Fallback)

TanStack Query ensures eventual consistency via:

* Mutation-based cache invalidation
* Refetch on window focus / reconnect
* Backend as single source of truth

This **hybrid approach** guarantees correctness even if sockets disconnect.

---

## Task Filtering & Sorting

Implemented **client-side** using derived state.

### Filters

#### By Status

* To Do
* In Progress
* Review
* Completed

#### By Priority

* Low
* Medium
* High
* Urgent

---

### Sorting

* By Due Date

  * Ascending
  * Descending

---

### Why Client-Side?

* Dataset expected to be moderate
* Avoids unnecessary API calls
* Remains compatible with real-time updates
* Keeps UI responsive

---

## Notification System (Frontend)

### Features

* Fetches persisted notifications after login
* Real-time notifications via Socket.io
* Read / unread state synchronized with backend
* Red dot indicator shown only when unread notifications exist
* Unread notifications highlighted with blue background

---

### Responsive UX

* **Desktop:** dropdown panel
* **Mobile:** full-width bottom sheet
* Touch-friendly and accessible

---

## Toast Notifications (UX Feedback)

The app uses **React Toastify** for consistent user feedback.

### Used For

* Login / Logout success & failure
* Registration feedback
* Task create / update / delete
* Profile update
* API and validation errors

---

### Design Principles

* Only user-visible actions trigger toasts
* No background refetch noise
* Short, actionable messages

---

## Architecture & Design Decisions (Frontend)

### Why TanStack Query?

* Separates server state from UI state
* Built-in caching and invalidation
* Automatic refetch on focus and reconnect
* Ideal for real-time synchronization patterns

---

### Why Context for Auth & Notifications?

* Cross-cutting application state
* Needed across routes and components
* Lightweight and predictable
* Avoids unnecessary Redux complexity

---

### Why JWT in Memory?

* Avoids CSRF risks associated with cookies
* Avoids XSS risks of `localStorage`
* Aligns HTTP and WebSocket authentication
* Explicit lifecycle control on logout
