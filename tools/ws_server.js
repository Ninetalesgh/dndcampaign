const WebSocket = require('ws');
const os = require('os');

function getLocalIpAddress() 
{
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) 
  {
    for (const iface of interfaces[interfaceName]) 
    {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
      }
    }
  }
  // Fallback if no IP address is found
  return '0.0.0.0'; 
}

const server = new WebSocket.Server({ port: 8081 });
const ipAddress = getLocalIpAddress();

console.log(`WebSocket server is running on ws://${ipAddress}:8081`);


let connectedClients = new Map();
let connectedDm = null;

function onMessage(message)
{
  console.log(`Forwarding: '${message}'`);

  server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) 
      {
      //  console.log(client);
      }
  });
 
  connectedClients.forEach(client => 
    {
      console.log(client);
      // if (client.socket.readyState === WebSocket.OPEN)
      // {
      //   client.socket.send(message);
      // }
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
        connectedClients.set(`${handshakeMatch[1]}`, socket);
        console.log(connectedClients);
      }
    }
    else
    {
      console.log(`Received message '${message}', not allowing the connection.`);
      socket.close();
    }
  });

  socket.on('close', () => {
      
      let client = connectedClients.find((client) => client.socket === socket);
      if (client)
      {
        //TODO remove from client list
        console.log(`'${client.name}' disconnected`);
      }
      else
      {
        console.log('A client disconnected');
      }
  });
});


