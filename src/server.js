const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
const connectDB = require('./db/db')
const colors = require('colors')
const path = require('path')

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