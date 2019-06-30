
/**
 * @type {any}
 */
const WebSocket = require('ws')
const setupWSConnection = require('y-websocket/bin/utils.js').setupWSConnection

const production = process.env.PRODUCTION != null
const port = process.env.PORT || 1234
const wss = new WebSocket.Server({ port })

wss.on('connection', setupWSConnection)

console.log(`Listening to http://localhost:${port} ${production ? '(production)' : ''}`)
