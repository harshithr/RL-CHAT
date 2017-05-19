const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const socketIO = require("socket.io");
const {generateMessage, generateLocationMessage} = require("./server/utils/message");

// using path module to access public folder
const publicPath = path.join(__dirname, "/public");
const port = process.env.PORT || 3000;

// using http node module to create server using express because socket.io do not support express server running.It needs node built-in server to run.
var server = http.createServer(app);

// initializing socket.io to run server from node http server.
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", function(socket) {
    console.log("New User connected");

    // Greet a new user who are joined to the socket
    socket.emit("newMessage", generateMessage("Admin", "Welcome to RL-CHAT"));

    // To alert new user is connected to chat
    socket.broadcast.emit("newMessage", generateMessage("Admin", "New User Joined"));

    // Getting the message or data from user to server
    socket.on("createMessage", function(newMsg, callback) {
        console.log("Created Email", newMsg);

        // Passing the gathered data from user variable which is newMsg to all other users connected.
        io.emit("newMessage", generateMessage(newMsg.from, newMsg.text));
        callback("This is from server");
    });

    socket.on("createLocationMessage", function(coords) {
        io.emit("newLocationMessage", generateLocationMessage("Admin", coords.latitude, coords.longitude));
    });

    socket.on("disconnect", function() {
        console.log("User was disconnected");
    });
});

server.listen(port, function() {
    console.log(`RL-CHAT serving on port ${port}`);
});

