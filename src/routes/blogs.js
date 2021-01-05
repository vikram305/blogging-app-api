const express = require('express')
const router = express.Router()

router.get('/',(req,res) => {
    res.status(200).json({ success: true, message: 'Show all blogs' })
})

router.get('/:id',(req,res) => {
    res.status(200).json({ success: true, message: `Show blog ${req.params.id}` })
})

router.post('/',(req,res) => {
    res.status(200).json({ success: true, message: 'Create new blog' })
})


router.put('/:id',(req,res) => {
    res.status(200).json({ success: true, message: `Update blog ${req.params.id}` })
})

router.delete('/:id',(req,res) => {
    res.status(200).json({ success: true, message: `Delete blog ${req.params.id}` })
})

module.exports =  router