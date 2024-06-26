const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
const connectDB = require('./db/db')
const colors = require('colors')
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// Route Files
const blogs = require('./routes/blogs')
const auth = require('./routes/auth')

// Load env vars
if(process.env.NODE_ENV !== 'production'){
    dotenv.config({ path: './config/config.env' })
    console.log(`port from config file : ${process.env.PORT}`)
}


// Connect to database
connectDB()

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Sanitize Data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent xss attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,    //10 minutes
    max: 1000 
})

app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Mount Routers
app.use('/api/v1/blogs',blogs)
app.use('/api/v1/auth', auth)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection',(err, promise) => {
    console.log(`Error: ${err.message}`.red)

    // Close server & exit process
    server.close(() => process.exit(1))
})