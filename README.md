ChatWave Backend
The ChatWave Backend is built with Node.js and Express to provide real-time messaging functionality using Socket.IO. It utilizes MongoDB for data storage and allows users to send and receive messages in real-time, similar to popular chat applications like WhatsApp.

Features:
Real-time communication using Socket.IO.

User authentication and message storage in MongoDB.

Supports both local MongoDB (via Mongo Compass) and MongoDB Atlas (Cluster) for database connection.

Prerequisites:
Node.js (v12 or higher)

MongoDB (Local Mongo Compass or MongoDB Atlas)

npm (Node Package Manager)

Setup Instructions:
1. Clone the repository:
First, clone the repository to your local machine:
  git clone https://github.com/your-username/ChatWaveBackend.git
  cd ChatWaveBackend

2. Install dependencies:
Run the following command to install the required node modules:

  bash
  Copy
  Edit
  npm install

3. Set up environment variables:
Create a .env file in the root of your project and add the following environment variables:

  USER = ""

  PASSWORD = ""
  MAIL_HOST = ""
  MAIL_PORT = ""

  POST = ""
  HOST = ""

4. Run the server:
Once the dependencies are installed and the environment variables are set, run the server using:

  bash
  Copy
  Edit
  npm start
This will start the server on the port specified in your .env file (default is 8000). The server will be ready to handle requests and real-time messaging.

5. Test the server:
To verify the server is running, you can open your browser or Postman and navigate to:

  http://localhost:5000
You should see a message indicating the server is up and running.

Usage:
The backend provides real-time messaging through Socket.IO. After connecting to the backend, users can send and receive messages instantly.

The MongoDB stores messages, user authentication details, and other necessary data.
