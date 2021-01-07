const Blog = require('../models/Blog')
const ErrorResponse = require('../utils/errorResponse')

//@desc     Get all blogs
//@route    GET /api/v1/blogs
//@access   Public
exports.getBlogs = async (req,res,next) => {
    try{
        const blogs = await Blog.find()

        res.status(200).json({ success: true, count: blogs.length, data: blogs })
    } catch(error){
        res.status(400).json({ success: false })
    }
}

//@desc     Get single blogs
//@route    GET /api/v1/blogs/:id
//@access   Public
exports.getBlog = async (req,res,next) => {
    try{
        const blog = await Blog.findById(req.params.id)

        if(!blog){
            // return res.status(400).json({ success: false })
            return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`,404))
        }

        res.status(200).json({ success: true, data: blog })
    } catch(error) {
        // res.status(400).json({ success: false })
        // next(error)
        next(new ErrorResponse(`Blog not found with id of ${req.params.id}`,404))
    }
}

//@desc     Create new blog
//@route    POST /api/v1/blogs
//@access   Private
exports.createBlog = async (req,res,next) => {

    try{
        const blog = await Blog.create(req.body)
        res.status(201).json({
            success: true,
            data: blog
        })
    } catch(error){
        res.status(400).json({ success: false })
    }
   
}

//@desc     Update blog
//@route    PUT /api/v1/blogs/:id
//@access   Private
exports.updateBlog = async (req,res,next) => {

    try{
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
    
        if(!blog){
            return res.status(400).json({ success: false })
        }
    
        res.status(200).json({ success: true, data: blog })
    } catch(error){
        res.status(400).json({ success: false })
    }
    
}

//@desc     Delete blog
//@route    DELETE /api/v1/blogs/:id
//@access   Private
exports.deleteBlog = async (req,res,next) => {
    try{
        const blog = await Blog.findByIdAndDelete(req.params.id)
    
        if(!blog){
            return res.status(400).json({ success: false })
        }
    
        res.status(200).json({ success: true, data: {} })
    } catch(error){
        res.status(400).json({ success: false })
    }
} 