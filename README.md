# StreamHub Backend

A production-ready backend API inspired by modern video streaming platforms like YouTube. StreamHub Backend is built using Node.js, Express.js, MongoDB, and JWT Authentication, following the MVC architecture and RESTful API design principles.

The project focuses on scalable backend development, secure authentication, media management, and database relationship handling. It demonstrates industry-standard backend practices including file uploads, Cloudinary integration, MongoDB Aggregation Pipelines, pagination, reusable utilities, and modular architecture.

---

## Features

### Authentication & Authorization

- User Registration & Login
- JWT Access Token Authentication
- Refresh Token Authentication
- Secure Logout
- Password Change
- Protected Routes
- Cookie-based Authentication

### User Management

- User Profile
- Update Account Details
- Update Avatar
- Update Cover Image
- Channel Profile
- Watch History

### Video Management

- Publish Video
- Get All Videos
- Get Video by ID
- Update Video
- Delete Video
- Toggle Publish Status

### Comments

- Add Comment
- Get Video Comments
- Update Comment
- Delete Comment

### Likes

- Like / Unlike Videos
- Like / Unlike Comments
- Like / Unlike Tweets
- Get Liked Videos

### Tweets

- Create Tweet
- Get User Tweets
- Update Tweet
- Delete Tweet

### Subscriptions

- Subscribe / Unsubscribe Channel
- Get Channel Subscribers
- Get Subscribed Channels

### Playlists

- Create Playlist
- Get User Playlists
- Get Playlist Details
- Update Playlist
- Delete Playlist
- Add Video to Playlist
- Remove Video from Playlist

---

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt
- Cookie Parser

### File Upload

- Multer
- Cloudinary

### Utilities

- dotenv
- CORS

### Development Tools

- Nodemon
- ESLint

---

## Project Structure

```text
StreamHub-Backend
│
├── src
│   ├── controllers
│   ├── db
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── utils
│   ├── app.js
│   └── index.js
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── README.md
└── LICENSE
```

---

## Architecture

The project follows the **MVC (Model-View-Controller)** architecture to keep the code modular, maintainable, and scalable.

- **Models** → Database schemas and relationships
- **Controllers** → Business logic and request handling
- **Routes** → API endpoint definitions
- **Middlewares** → Authentication and file uploads
- **Utils** → Reusable helper functions and services
- **Database** → MongoDB connection and configuration

---

## Database Models

The backend consists of the following MongoDB collections:

| Model | Purpose |
| -------- | --------- |
| User | User accounts, authentication, profiles, watch history |
| Video | Video metadata, thumbnails, publishing information |
| Comment | Comments on videos |
| Like | Likes for videos, comments, and tweets |
| Playlist | User-created playlists |
| Subscription | Channel subscription relationships |
| Tweet | Community posts created by users |

---

## Core Backend Features

- JWT Authentication with Refresh Tokens
- Password Hashing using bcrypt
- Cookie-based Authentication
- Cloudinary Media Uploads
- Multer File Handling
- MongoDB Aggregation Pipelines
- Pagination
- Authorization & Ownership Validation
- Reusable API Response Structure
- Global Error Handling
- Modular Route Management
- RESTful API Design
- Environment-based Configuration

---

## Design Principles

- Clean MVC Architecture
- Separation of Concerns
- Modular Codebase
- Reusable Utilities
- Consistent Error Handling
- REST API Best Practices
- Scalable Folder Structure
- Production-Oriented Backend Practices

---

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js (v20 or later recommended)
- MongoDB Atlas or Local MongoDB
- Cloudinary Account

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Bhargav3905/StreamHub-Backend.git
```

### 2. Navigate to the Project

```bash
cd StreamHub-Backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root using the following template:

```env
PORT=8000

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ORIGIN=http://localhost:3000
```

> **Note:** Never commit your `.env` file to GitHub.

---

## Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

---

## Available Scripts

| Command | Description |
| --------- | ------------- |
| `npm run dev` | Starts the development server using Nodemon |
| `npm start` | Starts the backend server |
| `npm run lint` | Runs ESLint for code analysis |
| `npm run lint:fix` | Automatically fixes lint issues where possible |

---

## API Base URL

```text
http://localhost:8000/api/v1
```

---

## API Modules

| Module | Base Route |
| --------- | ------------ |
| Users | `/users` |
| Videos | `/videos` |
| Comments | `/comments` |
| Likes | `/likes` |
| Tweets | `/tweets` |
| Subscriptions | `/subscriptions` |
| Playlists | `/playlists` |

---

## Authentication Methods

Protected routes require a valid JWT Access Token.

Authentication is supported using:

- HTTP-only Cookies
- Bearer Token (`Authorization: Bearer <token>`)

Both methods are supported throughout the project.

---

## Learning Outcomes

This project was built to strengthen backend development fundamentals through hands-on implementation of real-world concepts, including:

- RESTful API Development
- MVC Architecture
- JWT Authentication & Authorization
- MongoDB Schema Design & Relationships
- Aggregation Pipelines
- File Uploads with Multer & Cloudinary
- Pagination & Filtering
- CRUD Operations
- Error Handling & Custom API Responses
- Express Middleware
- Secure Backend Practices
- Clean Code Organization

---

## Future Improvements

Some features that can be added in future versions:

- Email Verification
- Forgot & Reset Password
- Video View History Tracking
- Search History
- Video Categories & Tags
- Notifications
- Real-time Features using Socket.IO
- Unit & Integration Testing
- Docker Support
- API Documentation using Swagger

---

## License

This project is licensed under the **MIT License**.

---

## Acknowledgements

This project was inspired by modern video streaming platforms and built as a backend learning project to practice scalable API development using the Node.js ecosystem.

Special thanks to **Chai aur Code** for providing valuable backend learning resources and inspiration throughout the development journey.

---

## Author

### Bhargav K. Prajapati

B.Tech Information and Communication Technology (ICT)

Pandit Deendayal Energy University (PDEU)

GitHub: **@Bhargav3905**

---

⭐ If you found this project helpful or interesting, consider giving it a star.
