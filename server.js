const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan')
const connectDB = require('./config/db')
const errorHanlder = require('./middleware/error')
const colors = require('colors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

// load env variables
dotenv.config({
  path: './config/config.env'
})

// connect db
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')

const app = express()

// body parser
app.use(express.json())

// cookie parser
app.use(cookieParser())

// dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// file upload
app.use(fileupload())

// set static folder (untuk frontend juga)
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)

// error handler for bootcamps, after app.use('/api/v1/bootcamps', bootcamps)
// middleware adalah sebuah function yang punya akses request response cycle dan berjalan pada cycle tersebut.
app.use(errorHanlder)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// handle unhandled promised rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // close server & exit process
  server.close(() => process.exit(1))
})