# Guard - Security Guard Hiring Platform

A comprehensive Node.js API for connecting security agencies with qualified guards for temporary jobs and permanent shifts.

## Features

### 🏢 For Companies/Agencies
- **Profile Management**: Create and manage company profiles with verification
- **Job Posting**: Post temporary security jobs with location and time requirements
- **Shift Management**: Create permanent shifts with recurring schedules
- **Guard Hiring**: Review applications and hire guards for jobs/shifts
- **Payment System**: Secure escrow payments with automatic release after 5 days
- **Attendance Tracking**: Monitor guard attendance with photo and location verification
- **Feedback System**: Rate and review guards

### 🛡️ For Security Guards
- **Profile Creation**: Build professional profiles with experience and certifications
- **Job Applications**: Apply for temporary jobs with competitive bidding
- **Shift Assignments**: Accept permanent shift offers
- **Attendance Management**: Check-in/out with photo and location verification
- **Payment Tracking**: View earnings and wallet balance
- **Feedback**: Rate companies and receive ratings

### 👨‍💼 For Administrators
- **User Management**: Approve/suspend users and resolve disputes
- **Platform Oversight**: Monitor jobs, shifts, payments, and attendance
- **Issue Resolution**: Handle disputes and platform maintenance

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

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=guard_db
   DB_USER=root
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE guard_db;
   
   # Run migrations
   npm run migrate
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Jobs (Temporary Work)
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Agency only)
- `PUT /api/jobs/:id` - Update job (Agency only)
- `DELETE /api/jobs/:id` - Delete job (Agency only)
- `GET /api/jobs/company/my-jobs` - Get company's jobs

### Shifts (Permanent Work)
- `GET /api/shifts` - Get all shifts (with filters)
- `GET /api/shifts/:id` - Get shift by ID
- `POST /api/shifts` - Create shift (Agency only)
- `PUT /api/shifts/:id` - Update shift (Agency only)
- `DELETE /api/shifts/:id` - Delete shift (Agency only)
- `POST /api/shifts/:id/assign` - Assign guard to shift
- `GET /api/shifts/company/my-shifts` - Get company's shifts
- `GET /api/shifts/guard/my-shifts` - Get guard's shifts

### Applications
- `POST /api/applications/jobs` - Apply for job (Guard only)
- `POST /api/applications/shifts` - Apply for shift (Guard only)
- `GET /api/applications/guard/my-applications` - Get guard's applications
- `GET /api/applications/jobs/:job_id` - Get job applications (Agency only)
- `GET /api/applications/shifts/:shift_id` - Get shift applications (Agency only)
- `PUT /api/applications/:id/accept` - Accept application (Agency only)
- `PUT /api/applications/:id/reject` - Reject application (Agency only)

### Attendance
- `POST /api/attendance/check-in` - Check in for job/shift (Guard only)
- `POST /api/attendance/check-out` - Check out from job/shift (Guard only)
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `PUT /api/attendance/:id/verify` - Verify attendance (Agency/Admin only)

### Wallet & Payments
- `GET /api/wallet` - Get wallet balance
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/wallet/add-funds` - Add funds to wallet
- `POST /api/wallet/withdraw` - Withdraw funds
- `POST /api/wallet/escrow` - Create escrow payment (Agency only)
- `POST /api/wallet/escrow/:id/release` - Release escrow funds (Admin only)

## Database Schema

### Core Entities
- **Users**: Authentication and basic user information
- **CompanyProfile**: Agency/company specific information
- **GuardProfile**: Guard specific information and qualifications
- **Jobs**: Temporary work opportunities
- **Shifts**: Permanent recurring work assignments
- **Applications**: Job/shift applications from guards
- **Attendance**: Check-in/out records with verification
- **Wallets**: User wallet balances
- **Transactions**: Payment and escrow transactions
- **Feedback**: Rating and review system

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for admins, agencies, and guards
- **Rate Limiting**: Protection against abuse and DDoS attacks
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: Secure password storage with bcrypt
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection

## Payment System

- **Escrow System**: Secure payment holding for 5 days
- **Automatic Release**: Funds automatically released after verification period
- **Wallet Integration**: Built-in wallet system for all users
- **Transaction History**: Complete audit trail of all payments
- **Multiple Payment Types**: Deposits, withdrawals, escrow, and releases

## Development

### Running Migrations
```bash
# Run all pending migrations
npm run migrate

# Undo last migration
npm run migrate:undo
```

### Database Seeding
```bash
# Run all seeders
npm run seed
```

### Environment Variables
See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@guardplatform.com or create an issue in the GitHub repository.

## Roadmap

- [ ] Mobile app development
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Integration with payment gateways
- [ ] Multi-language support
- [ ] Advanced geolocation features
- [ ] Automated background checks
- [ ] Insurance integration