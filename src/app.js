const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());
// Routes
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  return res.json({
    message: "hello world"
  })
})

//protected route
app.get('/api/protected', auth, (req, res) => {
  res.send('This is a protected route');
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));