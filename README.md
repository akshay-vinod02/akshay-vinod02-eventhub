# EventHub - Event Registration Platform

A full-stack event registration platform built with React.js and Django REST Framework.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS
- Backend: Django, Django REST Framework
- Database: SQLite
- Authentication: JWT

## Backend Setup

1. Clone the repository
   git clone https://github.com/akshay-vinod02/akshay-vinod02-eventhub.git
   cd akshay-vinod02-eventhub

2. Create virtual environment
   python -m venv venv
   venv\Scripts\activate

3. Install dependencies
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-decouple

4. Create .env file and add:
   SECRET_KEY=your-secret-key-here
   DEBUG=True

5. Run migrations
   python manage.py migrate

6. Create superuser
   python manage.py createsuperuser

7. Start server
   python manage.py runserver 8080

## Frontend Setup

1. Go to frontend folder
   cd frontend

2. Install dependencies
   npm install

3. Start frontend
   npm run dev

4. Open browser
   http://localhost:5174

## Database Setup

Go to http://127.0.0.1:8080/admin and login with superuser credentials to add events.

## API Documentation

Authentication:
POST /api/register/  - Register new user
POST /api/login/     - Login and get JWT token

Events:
GET /api/events/           - Get all events
GET /api/events/:id/       - Get single event

Registrations:
POST /api/events/:id/register/  - Register for event
GET  /api/my-registrations/     - Get my registrations

## Features

- User Registration and Login
- JWT Authentication
- Browse Events
- Register for Events
- View My Registrations
- Search Events
- Dark Mode
- Responsive Design
- Form Validation
- Loading States
- Error Handling

## Project Structure

eventhub/
├── backend/       - Django settings
├── users/         - Authentication app
├── events/        - Events and Registrations app
├── frontend/      - React application
│   └── src/
│       ├── api/         - Axios config
│       ├── components/  - Navbar, ProtectedRoute
│       ├── context/     - Auth Context
│       └── pages/       - All 5 pages
├── manage.py
└── README.md