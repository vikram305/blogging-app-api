const Blog = require('../models/Blog')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

//@desc     Get all blogs
//@route    GET /api/v1/blogs
//@access   Private
exports.getBlogs = asyncHandler(async (req,res,next) => {

    
    res.status(200).json(res.advancedResults)
})

//@desc     Get single blogs
//@route    GET /api/v1/blogs/:id
//@access   Private
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

    req.body.user = req.user.id
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

        let blog = await Blog.findById(req.params.id)
    
        if(!blog){
            // return res.status(400).json({ success: false })
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`,404))
        }

        // Make sure user is blog owner
        if(blog.user.toString() !== req.user.id){
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this blog`,401))
        }

        blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
    
        res.status(200).json({ success: true, data: blog })
    
})

//@desc     Delete blog
//@route    DELETE /api/v1/blogs/:id
//@access   Private
exports.deleteBlog = asyncHandler(async (req,res,next) => {
    
        const blog = await Blog.findById(req.params.id)
    
        if(!blog){
            // return res.status(400).json({ success: false })
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`,404))
        }

        // Make sure user is blog owner
        if(blog.user.toString() !== req.user.id){
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this blog`,401))
        }
        blog.remove()
    
        res.status(200).json({ success: true, data: {} })

})