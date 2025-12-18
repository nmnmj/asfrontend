Collaborative Task Manager – Frontend

This repository contains the frontend application for the Collaborative Task Manager.
It is a production-ready React application built with TypeScript, real-time updates, and modern state management.

Tech Stack (Frontend)

React (Vite)
TypeScript
Tailwind CSS
React Query (TanStack Query) – server state & caching
Socket.io Client – real-time updates
React Hook Form + Zod – form handling & validation
React Router – routing

Project Setup
Prerequisites
Node.js ≥ 18
Backend running locally (see backend repo)

1️ Install Dependencies
npm install

2️ Environment Variables
Create a .env file in the project root:
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000

3️ Run Frontend Locally
npm run dev
Application runs at:
http://localhost:5173

Authentication Flow (Frontend)
Authentication is handled via JWT stored in HttpOnly cookies
Frontend never accesses the token directly
On app load:
/api/users/me is called
User state is hydrated
Protected routes are enforced using a ProtectedRoute component
API Contract (Frontend Perspective)
The frontend consumes the following backend endpoints:
User APIs
GET /api/users/me – fetch logged-in user
PUT /api/users/me – update profile
GET /api/users/all – list users (for task assignment)
Task APIs
GET /api/tasks
GET /api/tasks/:id
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
Notification APIs
GET /api/notifications
PATCH /api/notifications/:id/read

Real-Time Functionality (Socket.io)
How Socket.io Is Used (Frontend)
Socket is initialized once globally
After login, the user joins a private room using their userId
Listens to backend events:
task:created        
task:updated	    
task:deleted 
notification:new
Effects on UI
Task events → React Query cache invalidation
Notification events → appended to global notification state
No polling required

Task Filtering & Sorting
Implemented client-side using derived state:
Filters
By Status (To Do, In Progress, Review, Completed)
By Priority (Low, Medium, High, Urgent)
Sorting
By Due Date (Ascending / Descending)
This approach:
Avoids unnecessary API calls
Remains compatible with real-time updates
Keeps UI responsive

Notification System (Frontend)
Features
Fetches persisted notifications after login
Real-time notifications via Socket.io
Read / unread state synchronized with backend
Red dot indicator shown only when unread notifications exist
Unread notifications highlighted with blue background
Responsive UX
Desktop: dropdown panel
Mobile: bottom-sheet panel
Touch-friendly and accessible

Architecture & Design Decisions (Frontend)
Why React Query?
Separates server state from UI state
Built-in caching, refetching, and synchronization
Ideal for real-time invalidation patterns

Why Context for Notifications?
Notifications are cross-cutting UI state
Need to persist across pages
Lightweight alternative to Redux

Why Client-Side Filtering?
Dataset expected to be moderate
Improves perceived performance
Simplifies backend API surface
