const WebSocket = require('ws')
const express = require('express')
const app = express()
const path = require('path')

app.use('/', express.static(path.resolve(__dirname, '../client')))

const server = app.listen(9876)

const wss = new WebSocket.Server({
	noServer: true
})

wss.on('connection', function(ws) {
	console.log('websocket connected')
})
wss.on('message', function(message) {
	console.log('ws on msg')
})

server.on('upgrade', async function upgrade(request, socket, head) {
	// Do what you normally do in `verifyClient()` here and then use
	// `WebSocketServer.prototype.handleUpgrade()`.

	// test for authentication
    
	wss.handleUpgrade(request, socket, head, function done(ws) {
		wss.emit('connection', ws, request)
	})
})
