const express = require('express')
const cors = require('cors')
const fs = require('fs')
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app = express()
app.use(cors(corsOptions))
const server = require('http').createServer(app);
const { Server, Socket } = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.get('/events', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    let count = 1
    const sendEvent = () => {
        // res.write("data: " + '{ "username": "bobby", "time": "02:33:48" }' + '\n\n' + "data: " + count + '\n\n');
        // res.write(`id: 42` + `\n\n` +
        //     `event: btcTicker` + `\n\n` +
        //     `data: btc 2002867` + `\n\n`)
        res.write("data: " + '{ "count": ' + count + '}' + '\n\n');
        count += 1
        setTimeout(sendEvent, 2000);
    }
    sendEvent();
})
let socketID;
let socketio = { socket: '' };
io.on('connection', (socket) => {
    socketID = socket.id
    socketio.socket = socket
    console.log('a user connected');
    socket.on('message', (msg) => {
        fs.writeFileSync('data.txt', "Hello", { flag: "a+" })
        console.log(msg);
    });
    // socket.emit('message', { count: 99 });
});


app.get('/test', (req, res) => {
    io.to(socketID).emit('message', { count: 100 });
    // socketio.socket.emit('message', { count: 100 });
    res.send("Node-Socket.js")
    // res.send({ status: 1, socketID: socketID })
})
app.get('/', (req, res) => {
    res.send("Node.js")
})

server.listen(4000, '0.0.0.0', () => {
    console.log("Server Successfully started")
})