const WebSocket = require('ws');
const os = require('os');

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
      for (const iface of interfaces[interfaceName]) {
          // Skip internal (loopback) and non-IPv4 addresses
          if (iface.family === 'IPv4' && !iface.internal) {
              return iface.address;
          }
      }
  }
  return '0.0.0.0'; // Fallback if no IP address is found
}

const server = new WebSocket.Server({ port: 8080 });

// Get the local IP address
const ipAddress = getLocalIpAddress();

console.log(`WebSocket server is running on ws://${ipAddress}:8080`);

server.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Broadcast the message to all connected clients
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        console.log('A client disconnected');
    });
});

console.log('WebSocket server is running on ws://0.0.0.0:8080');



