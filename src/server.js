const http = require('http')

const todos = [
    {id: 1, text: 'Todo 1'},
    {id: 2, text: 'Todo 2'},
    {id: 3, text: 'Todo 3'},
    {id: 4, text: 'Todo 4'}
]
const server = http.createServer((req,res) => {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('X-Powerd-By', 'Node.js')
    res.end(
        JSON.stringify({
            success: true,
            data: todos 
        })
    )
})

const PORT =5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))