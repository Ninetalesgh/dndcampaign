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

console.log(`WebSocket server is running on wss://${ipAddress}:8080`);

class ConnectedPlayer
{
  constructor(name, socket)
  {
    this.socket = this.socket;
    this.name = name;
  }
}

let connectedClients = new Array();
let connectedDm = null;

function onMessage(message)
{
  console.log(`Forwarding: '${message}'`);
  server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) 
      {
          client.send(message);
      }
  });
}


server.on('connection', (socket) => {
  socket.on('message', (message) => {
    const handshakeMatch = message.toString().match(/'(.*)' handshake!/);
    if (handshakeMatch)
    {
      socket.removeAllListeners('message');

      if (handshakeMatch[1] === 'dm')
      {
        connectedDm = socket;
        //only add the dm back as messenger here
        console.log(`The almighty dungeon master has connected!`);
        socket.on('message', onMessage);
      }
      else
      {
        console.log(`'${handshakeMatch[1]}' connected!`);
        connectedClients.push(new ConnectedPlayer(handshakeMatch[1], socket));
      }
    }
    else
    {
      console.log(`Received message '${message}', not allowing the connection.`);
      socket.close();
    }
  });

  socket.on('close', () => {
      console.log('A client disconnected');
  });
});


