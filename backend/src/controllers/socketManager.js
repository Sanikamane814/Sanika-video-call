import { Server } from "socket.io";

// Use consistent pluralized names
let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server,{
        cors:{
            origin:"*",
            methods:["GET","POST"],
            allowedHeaders:["*"],
            credentials: true

        }
    });

    io.on("connection", (socket) => {
        // When a user joins a call
        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Notify all users in the room
            for (let i = 0; i < connections[path].length; i++) {
                io.to(connections[path][i]).emit("user-joined", socket.id, connections);
            }

            // Send existing chat messages to the newly joined user
            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; a++) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path][a]['data'],
                        messages[path][a]['sender'],
                        messages[path][a]['socket-id-sender']
                    );
                }
            }
        });

        // Signaling for WebRTC
        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        // Chat message handling
        socket.on("chat-message", (data, sender) => {
            let matchingRoom = '';
            let found = false;

            for (const [roomKey, roomValue] of Object.entries(connections)) {
                if (roomValue.includes(socket.id)) {
                    matchingRoom = roomKey;
                    found = true;
                    break;
                }
            }

            if (found) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({
                    sender: sender,
                    data: data,
                    'socket-id-sender': socket.id
                });

                // Broadcast message to all in the room
                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        // On disconnect
        socket.on("disconnect", () => {
            const disconnectTime = new Date();
            const joinTime = timeOnline[socket.id];
            const diffTime = Math.abs(joinTime - disconnectTime);

            let keyToRemove = null;

            for (const [key, value] of Object.entries(connections)) {
                const index = value.indexOf(socket.id);
                if (index !== -1) {
                    keyToRemove = key;

                    // Notify others that this user left
                    connections[key].forEach((id) => {
                        io.to(id).emit("user-left", socket.id);
                    });

                    // Remove user from room
                    connections[key].splice(index, 1);

                    if (connections[key].length === 0) {
                        delete connections[key];
                    }

                    break;
                }
            }

            delete timeOnline[socket.id];
        });
    });

    return io;
};
