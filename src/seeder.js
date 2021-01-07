const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotevn = require('dotenv')

// Load env vars
dotevn.config({ path: './config/config.env' })

// Load models
const Blog = require('./models/Blog')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

// Read Json File
const blogs = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/blogs.json`,'utf-8')
)

// Import into DB
const importData = async () => {
    try{
        await Blog.create(blogs)

        console.log(`Data Imported...`.green.inverse)
        process.exit()
    } catch(error){
        console.log(error)
    }
}

// Delete Data
const deleteData = async () => {
    try{
        await Blog.deleteMany()

        console.log(`Data Destroyed...`.red.inverse)
        process.exit()
    } catch(error){
        console.log(error)
    }
}

if(process.argv[2] === '-i'){
    importData()
} else if(process.argv[2] === '-d'){
    deleteData()
}