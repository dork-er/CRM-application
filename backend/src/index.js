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
- Reduce jwt access token duration to 15 minutes.
*/

// Routes
// User application route
app.use('/api/applications', require('./routes/applicationRoutes'));

// User authentication route
app.use('/api/auth', require('./routes/authRoutes'));

// User route
app.use('/api/users', require('./routes/userRoutes'));

// Reports route
app.use('/api/reports', require('./routes/reportRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
