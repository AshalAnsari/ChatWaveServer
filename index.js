const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dbConnect = require("./utils/dbConnect");
const UserRoutes = require("./routes/UserRoutes");
const { connect, disConnect, checkBeforeSendingMessage, addToPendingMessages, checkForPendingMessages, socketDisconnect } = require("./controllers/userControllers");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());

// MongoDB Connection
dbConnect();

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/user', UserRoutes);

io.on('connection', (socket) => {
    console.log("first");
    console.log('A user connected:', socket.id);

    // User connected event
    socket.on('userConnected', async (email) => {
        await connect(email, socket.id); // Call async function with await
        const pendingMessages = await checkForPendingMessages(email);

        if (pendingMessages) {
            socket.emit('pendingmessages', pendingMessages); // Emit pending messages
        }
    });

    // Message sending event
    socket.on('message', async (data) => {
        try {
            console.log('Checking recipient:', data.recipient, 'with message:', data.message);
            const decider = await checkBeforeSendingMessage(data.recipient, data.message);
            // console.log('Check result:', decider);
            
            if (decider === 0) {
                await addToPendingMessages(data.sender, data.recipient, data.message);
            } else if (decider === 2) {
                console.log("User doesn't exist");
            } else if (decider === 3) {
                console.log("An error occurred while sending the message");
            }
            else {
                console.log("firing");
                data.recipient = decider;
                io.to(decider).emit('msg', data); // Send message to the specific recipient
            } 
        } catch (error) {
            console.log("Error handling message:", error);
        }
    });

    // User disconnected event
    socket.on('userDisconnected', async (email) => {
        await disConnect(email);
        console.log(`Socket disconnected: ${socket.id}`);
        console.log('User disconnected:', socket.id);
    });

    // On disconnection
    socket.on('disconnect', async (reason) => {
        await socketDisconnect(socket.id);
        console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
        console.log('Socket disconnected:', socket.id);
    });
});

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is listening at ${process.env.HOST}`);
});
