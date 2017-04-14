// server.js

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
// const WebSocket = require('ws');
const uuid = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};


// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.


wss.on('connection', (ws) => {
  console.log('Client connected');
 
  ws.on('close', () => {
    console.log('disconnected');
  });

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    data.id = uuid();
    wss.broadcast(JSON.stringify(data)); 
  });
});




  server.listen(3001, function () {
  console.log('listening!');
});
