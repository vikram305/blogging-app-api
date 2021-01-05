const express = require('express')
const dotenv = require('dotenv')


// Route Files
const blogs = require('./routes/blogs')

if(process.env.NODE_ENV !== 'production'){
    dotenv.config({ path: './config/config.env' })
    console.log(`port from config file : ${process.env.PORT}`)
}

const app = express()

// Mount Routers
app.use('/api/v1/blogs',blogs)

const PORT = process.env.PORT || 5000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)