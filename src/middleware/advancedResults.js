const asyncHandler = require("./async");

const advancedResults = (model, populate) =>  async(req, res, next) => {

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
    query = model.find(searchQuery)
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

    // Pagination
    const page = parseInt(reqQuery.page,10) || 1
    const limit = parseInt(reqQuery.limit,10) || 1
    

    query = query.limit(limit*1)
                .skip((page-1) *limit)

    // Get total document count
    const count = await model.countDocuments()

    // Populate
    if(populate){
        query = query.populate(populate)
    }

    // Executing query
    const result = await query
     
    res.advancedResults ={
        success: true, 
        count: result.length, 
        totalPages: Math.ceil(count/limit),
        currnetPage: page,
        data: result 
    }

    next()
}

module.exports = advancedResults