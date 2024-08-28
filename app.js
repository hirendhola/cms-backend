const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const adminAuthRoute = require('./routes/admin/adminAuth.router');
const hodAuthRoute = require('./routes/hod/hodAuth.router');
const departmentRoute = require('./routes/admin/department.router')
const adminRoute = require('./routes/admin/admin.router')
const hodRoute = require('./routes/hod/hod.router')
const cors = require('cors');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes 

//admin
app.use('/api/auth/admin/', adminAuthRoute);
app.use('/api/admin/department/', departmentRoute);
app.use('/api/admin/', adminRoute);

//hod
app.use('/api/auth/hod/', hodAuthRoute)
app.use('/api/hod', hodRoute)

//teacher


//student




app.get('/', (req, res) => {
  return res.json({
    message: "hello world"
  })
})

//protected route
// app.get('/api/protected', auth(), (req, res) => {
//   res.send('This is a protected route');
// });

// undefined route
app.use((req, res, next) => {
  res.status(404).send({
    message: "Oops! Looks like you got lost."
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));