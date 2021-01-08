const Blog = require('../models/Blog')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

//@desc     Get all blogs
//@route    GET /api/v1/blogs
//@access   Public
exports.getBlogs = asyncHandler(async (req,res,next) => {

    let searchQuery = {}
    let query

    // Copy req.query
    const reqQuery = {...req.query}
    console.log(reqQuery)
    
    // checking if query string available
    // ex: blogs?query=blog1
    if(reqQuery.query){
        searchQuery = {$or:[{title:{$regex: reqQuery.query, $options: 'i'}},{body:{$regex: reqQuery.query, $options: 'i'}}]}
    }

    // Finding resource
    query = Blog.find(searchQuery)
    // const blogs = await Blog.find(query)


    // Selecting fields
    if(reqQuery.select){
        const fields = reqQuery.select.split(',').join(' ')
        console.log(fields)
        query = query.select(fields)
    }

    // Sort 
    if(reqQuery.sort){
        const  sortBy = reqQuery.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else{
        query = query.sort('-createdAt')
    }

    // Executing query
    const blogs = await query
    res.status(200).json({ success: true, count: blogs.length, data: blogs })
})

//@desc     Get single blogs
//@route    GET /api/v1/blogs/:id
//@access   Public
exports.getBlog = asyncHandler(async (req,res,next) => {
    
    const blog = await Blog.findById(req.params.id)

    if(!blog){
        // return res.status(400).json({ success: false })
         return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`,404))
    }

    res.status(200).json({ success: true, data: blog })
        
})

//@desc     Create new blog
//@route    POST /api/v1/blogs
//@access   Private
exports.createBlog = asyncHandler(async (req,res,next) => {

    const blog = await Blog.create(req.body)
    res.status(201).json({
        success: true,
        data: blog
    })

})

//@desc     Update blog
//@route    PUT /api/v1/blogs/:id
//@access   Private
exports.updateBlog = asyncHandler(async (req,res,next) => {

        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
    
        if(!blog){
            // return res.status(400).json({ success: false })
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`,404))
        }
    
        res.status(200).json({ success: true, data: blog })
    
})

//@desc     Delete blog
//@route    DELETE /api/v1/blogs/:id
//@access   Private
exports.deleteBlog = asyncHandler(async (req,res,next) => {
    
        const blog = await Blog.findByIdAndDelete(req.params.id)
    
        if(!blog){
            // return res.status(400).json({ success: false })
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`,404))
        }
    
        res.status(200).json({ success: true, data: {} })

})