const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const errorHandler = require('./middleware/error')
const connectDB = require('./db/db')
const colors = require('colors')

// Route Files
const blogs = require('./routes/blogs')

// Load env vars
if(process.env.NODE_ENV !== 'production'){
    dotenv.config({ path: './config/config.env' })
    console.log(`port from config file : ${process.env.PORT}`)
}

// Connect to database
connectDB()

const app = express()

//Body parser
app.use(express.json())


// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Mount Routers
app.use('/api/v1/blogs',blogs)

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