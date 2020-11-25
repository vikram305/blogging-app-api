const { read } = require('fs')
const http = require('http')

const todos = [
    {id: 1, text: 'Todo 1'},
    {id: 2, text: 'Todo 2'},
    {id: 3, text: 'Todo 3'},
    {id: 4, text: 'Todo 4'}
]
const server = http.createServer((req,res) => {
   
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Powerd-By': 'Node.js'
    })

    console.log(req.headers.authorization)
    
    let body = []

    req.on('data', chunk => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString()
        console.log(body)
    })

    res.end(
        JSON.stringify({
            success: true,
            data: todos
        })
    )
})

const PORT =5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))