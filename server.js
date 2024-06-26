const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken');



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for messages
const messages = {};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', async (data) => {
        const { friendId, token } = data;
        const decoded = jwt.decode(token);
        console.log(`User joined: ${decoded.uuid}`);
        socket.join(decoded.uuid);
        socket.friendId = friendId;
    });

    socket.on('sendMessage', async (data) => {
        try {
            const friendId = socket.friendId;
            const message = data.data;
            console.log(`Message from ${socket.id} to ${friendId}:`, message);
            message.MessageType = 0;
            socket.broadcast.to(friendId).emit('receiveMessage', { message });
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


server.listen(PORT, (e) => {
    
    
    console.log(`Connected`);
    console.log(`Running on port ${PORT}`);
});
// require('http').createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end('' +
// `<html>
//   <head></head>
//   <body>
//     Data render at browser page
//     <script>
//       /********** Browser start ********/
//       /* This code is run in the browser */
//       console.log('print in browser console ');
//       /********** Browser end ********/
//     </script>
//   </body>
// </html>`);
//     console.log('print in Node.js engine');   
// }).listen(4000);
