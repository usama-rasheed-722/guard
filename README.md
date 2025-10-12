# Guard - Security Guard Hiring Platform

A comprehensive Node.js API for connecting security agencies with qualified guards for temporary jobs and permanent shifts.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Validation**: Express-validator
- **Password Hashing**: bcryptjs

## Project Structure

```
guard/
├── src/
│   ├── controllers/          # Business logic controllers
│   ├── models/              # Sequelize database models
│   ├── middleware/          # Authentication, validation, rate limiting
│   ├── helpers/             # Utility functions
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic services
│   └── utils/               # General utilities
├── config/                  # Database and app configuration
├── migrations/              # Database migrations
├── seeders/                 # Database seeders
├── uploads/                 # File upload storage
├── public/                  # Static files
└── index.js                 # Main application entry point
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/usama-rasheed-722/guard.git
   cd guard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
