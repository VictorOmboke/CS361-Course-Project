# SCREENi - The App Created to Tackle Your Backlog

A full-stack web application designed to help users search, track, and manage their personal movie and TV show watchlists. Built with a React frontend, a Node.js/Express backend, and a MySQL database, featuring secure JWT authentication with HttpOnly refresh cookies and TMDb API integration.

---

## Features

- **Secure Authentication**: User registration and login powered by Argon2 password hashing, short-lived JSON Web Tokens (JWT) for access control, and 7-day secure HttpOnly cookies for automatic token refreshing.
- **TMDb Discovery & Search**: Live search integration mapping movie and TV data straight from The Movie Database (TMDb).
- **Watchlist CRUD & Sorting**: Add titles, toggle between custom sorting orders (Oldest/Newest), and delete items.
- **"Rando" Decision Maker**: A built-in feature that randomly selects a title from your watchlist and fetches on-demand metadata when you suffer from analysis paralysis.
- **Responsive UI Modals**: Clean frosted-glass overlays and responsive grid layouts for item detail views and deletes.

---

## Tech Stack

- **Frontend**: React, React Router, Lucide Icons, Vanilla CSS (Flexbox & CSS Grid)
- **Backend**: Node.js, Express, JWT, Cookie-Parser, Argon2
- **Database**: MySQL

---

## Getting Started Locally

Follow these steps to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/)

Make sure you have an account on TMDb.com to get your API key and Access Token

- [TBDb API](https://developer.themoviedb.org/docs/getting-started)

### 1. Clone the Repository

```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
cd YOUR_REPOSITORY_NAME
```

### 2. Database Setup

## 2.1 Log into your local MySQL instance and create your database

```sql
CREATE DATABASE watchlist_db;
```

## 2.2 Paste in the SQL code found in schema.sql into your database instance to create all the tables and DDL.

### 3. Backend Setup

## 3.1 Navigate to your backend directory

```bash
cd backend
```

## 3.2 Install dependencies

```bash
npm install
```

## 3.3 Create a .env file in the root of your backend directory and configure your environment variables. MAKE SURE TO PUT YOUR .env FILE IN YOUR .gitignore file

```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=watchlist_db
JWT_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
TMDB_API_KEY=your_tmdb_api_key
```

## 3.4 Start the backend server

```bash
npm run dev
```

### 4. Frontend Setup

## 4.1 Open a new terminal tab and navigate to your frontend directory

```bash
cd frontend
```

## 4.2 Install dependencies

```bash
npm install
```

## 4.3 Start the Vite development server

```bash
npm run dev
```

## 4.4 Open your browser and navigate to http://localhost:5173 (or the local port provided by Vite)
