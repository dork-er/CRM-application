require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

/*
! REMINDER.
? Implement file upload.
- Reduce jwt access token duration to 15 minutes.
- Implement refresh tokens.
- Implement pagination features
- Add real-time notifications.
- Implement search features
- Implement sorting features
- Implement filtering features
- Implement user roles.
- Implement user permissions.
- Implement user settings.
- Implement users activity log.
*/

// ROUTES

// User application route
app.use('/api/applications', require('./routes/applicationRoutes'));

// User authentication route
app.use('/api/auth', require('./routes/authRoutes'));

// User route
app.use('/api/users', require('./routes/userRoutes'));

// Reports route
app.use('/api/reports', require('./routes/reportRoutes'));

// Report response route
app.use('/api/response', require('./routes/reportResponseRoutes'));

// Dashboard route
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Admin route
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
