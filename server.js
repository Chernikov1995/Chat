const http = require('http')
const messageHistorySize = 10
const host = '127.0.0.1'
const port = 8000
const messages = []


const requestListener = (request,response) => {
    if (request.method === 'POST' && request.url === '/api/post') {
        let body = []
        request.on('data', (chunk) => {
            body.push(chunk)
        }).on('end', () => {
            const tojson = Buffer.concat(body).toString()
            const msg = JSON.parse(tojson)
            if (messages.length >= messageHistorySize){
                messages.shift()
            }
            messages.push(msg)
            console.log(messages)
            response.setHeader('Content-Type', 'application/json')
            response.setHeader('Access-Control-Allow-Origin', '*')
            response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')
            response.status = 200
            response.end(JSON.stringify({
                status: 'ok'
            }))
        })
    }


    if (request.method === 'GET' && request.url === '/api/get') {
        response.setHeader('Content-Type', 'application/json')
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')
        response.status = 200
        response.end(JSON.stringify({
            msg: messages
        }))
    }
}
const server = http.createServer(requestListener)
server.listen(port,host,()=>{
    console.log(`server running at http://${host}:${port}`)
})
