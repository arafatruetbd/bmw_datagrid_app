# BMW IT Internship - Aptitude Test Project

## Overview

This project demonstrates a full-stack web application built for BMW's IT Internship Aptitude Test. The app loads electric car data into a MySQL database, serves it with an Express.js backend, and displays it in an interactive React AG Grid UI.

## Features

- 🌐 Full-stack app (React + Express + MySQL)
- 📊 Generic AG Grid with dynamic columns
- 🔍 Search and advanced filters (contains, equals, etc.)
- 🧭 Detail view navigation
- ❌ Delete entries from database

## Tech Stack

- Frontend: React, MUI, AG Grid
- Backend: Node.js, Express.js
- Database: MySQL (running in Docker container)

## Setup Instructions

### 1. Setup MySQL with Docker

A Docker Compose file (`docker-compose.yml`) is included in the root directory to run MySQL in a container.

```bash
docker-compose up -d
```

This will start a MySQL 8.0 container named `bmw-mysql`, exposing port `3307` on localhost.

---

### 2. Initialize Database Schema and Tables

After the MySQL container is running, initialize the database schema:

1. **Open MySQL terminal inside container:**

```bash
docker exec -it bmw-mysql mysql -u root -p
```

2. **Enter the root password:**

```
arafat@bmw_db
```

3. **Switch to the database:**

```sql
USE bmw_db;
```

4. **Create the `electric_cars` table:**

```sql
CREATE TABLE electric_cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Brand VARCHAR(100),
  Model VARCHAR(100),
  Variant VARCHAR(100),
  Battery_kWh FLOAT,
  -- Add other fields as needed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. **Exit the MySQL shell:**

```sql
exit;
```

_Optional:_ You can also automate this by running a SQL script:

```bash
docker exec -i bmw-mysql mysql -u root -p bmw_db < path/to/schema.sql
```

---

### 3. Import CSV Data into Database

Use the provided import script to load data from CSV into the database:

```bash
cd scripts
node importCsvToMySQL.js
```

Make sure your database and table exist before running this.

---

### 4. Start Backend Server

```bash
cd server
yarn
yarn run dev
```

The backend will be accessible at `http://localhost:4000`.

---

### 5. Start Frontend Application

```bash
cd client
yarn 
yarn start
```

The React app will open in your browser (usually at `http://localhost:3000`).

---

## Demo Video & Presentation

- 🔗 Demo: \[YouTube Link Placeholder]
- 📑 Slides: \[Presentation Placeholder]

---

## Author

Created by Arfat Hossain for BMW Internship Application
