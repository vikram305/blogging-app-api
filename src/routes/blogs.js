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

const { protect } = require('../middleware/auth')


const router = express.Router()

router
    .route('/')
    .get(protect, advancedResults(Blog) ,getBlogs)
    .post(protect, createBlog)

router
    .route('/:id')
    .get(protect, getBlog)
    .put(protect, updateBlog)
    .delete(protect, deleteBlog)

module.exports =  router