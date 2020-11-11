const http = require('http')
const messageBuffersize = 100
const host = '127.0.0.1'
const port = 8000
let messages = []

const requestListener = (request,response) => {

    if (request.method === 'POST' && request.url === '/api/post') {
        let body = []
        request.on('data', (chunk) => {
            body.push(chunk)
        }).on('end', () => {
            const json = Buffer.concat(body).toString()
            const msg = JSON.parse(json)
            if (messages.length >= messageBufferSize){
                messages = messages.slice(50)
            }
            messages.push(msg)
            response.setHeader('Content-Type', 'application/json')
            response.setHeader('Access-Control-Allow-Origin', '*')
            response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept,')
            response.status = 200
            response.end(JSON.stringify({
                status: 'ok'
            }))
        })
    }


    if (request.method === 'GET' && request.url === '/api/get') {
        response.setHeader('Content-Type', 'application/json')
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept,')
        response.status = 200
        response.end(JSON.stringify({
            msg: messages,
        }))
    }
}
const server = http.createServer(requestListener)
server.listen(port,host,()=>{
    console.log(`server running at http://${host}:${port}`)
})
