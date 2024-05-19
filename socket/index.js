export const initializeSocketIO = (io) => {
    return io.on("connection", async (socket) => {
        try {
            const { user } = socket.handshake.headers;
            console.log('socket connected >>>>', user);

            // // online
            // await updateUserById(user, { online: true });

            // We are creating a room with user id so that if user is joined but does not have any active chat going on.
            // still we want to emit some socket events to the user.
            // so that the client can catch the event and show the notifications.
            // socket.join(user);

            //     Common events that needs to be mounted on the initialization
            //     mountJoinChatEvent(socket);
            //     mountParticipantTypingEvent(socket);
            //     mountParticipantStoppedTypingEvent(socket);

            socket.on("disconnect", async () => {
                console.log("user has disconnected..", user);

                // // offline status
                // await updateUserById(user, { online: false });
            });

        } catch (error) {
            socket.emit("socket-error", error?.message || "Something went wrong while connecting to the socket.");
        }
    });
};

export const emitSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").in(roomId).emit(event, payload);
};
