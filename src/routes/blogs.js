const express = require('express')
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogs')

const Blog = require('../models/Blog')
const advancedResults = require('../middleware/advancedResults')


const router = express.Router()

router
    .route('/')
    .get(advancedResults(Blog) ,getBlogs)
    .post(createBlog)

router
    .route('/:id')
    .get(getBlog)
    .put(updateBlog)
    .delete(deleteBlog)

module.exports =  router