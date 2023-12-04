const { createServer } = require("net");

const server = createServer();

// importing net from nodejs built-in libraries

let socketCount = 0;

//To start, we set the number of sockets equal to 0.

const sockets = {}

server.on("connection", (socket) => {
    console.log("a client connected!")
    let username = "";
    socket.write("Enter your username: ")
    socket.id = socketCount++;
    sockets[socket.id] = socket;
    socket.on('data', (data) => {
        if (!username) {
            username = data;
            socket.username = username;
            broadCastMessage(socket, `${socket.username.toString().trim()} connected `)
        }
        //If the username is not specified, we set the first chat entry equal to the username.
        else {
            console.log(data.toString())
            broadCastMessage(socket,`${socket.username.toString().trim()}: ${data.toString().trim()} \n`);

        }
        //If the username has been determined beforehand, we will send the chat entries as a message.
    })

    socket.on('error', (err) => {

        if (err.code === "ECONNRESET") {
            console.log("user disconnected");
            delete sockets[socket.id];
            broadCastMessage(socket, `${socket.username.toString().trim()} disconnected`)


        }

        else {
            console.log(err);
        }

    })


})

//If the sockets disconnect, we check the error.

const broadCastMessage = (sourcesocket, message) => {

    Object.entries(sockets).forEach(([id, sock]) => {
        if (Number(id) !== sourcesocket.id) {
            sock.write(message);
        }
    })


}

// We forward the message to every socket except the source socket.



server.listen(9001, () => {
    console.log("Chat server is running");
})

// The server is listened to on the specified port.