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

function fetchClientByName(name)
{
  
}

function onMessage(message)
{
  //TODO filtering here
  const matches = message.matches(/^>\|\|([a-z]+)\|\|<\s(.*)/, 'gm');

  for (let match of matches)
  {
    if (match[1])
    {

    } 
    match[2]
  }

  console.log(`Forwarding '${message}' to:`); 
  for (let [key, value] of connectedClients)
  {
    if (value instanceof WebSocket && value.readyState === WebSocket.OPEN)
    {
      console.log(`  '${key}'`);
      value.send(message);
    }
  }
}

let unnamedClientIndex = 0;
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
      }
    }
    else
    {
      connectedClients.set(`unnamed_client_${unnamedClientIndex++}`, socket);
      //console.log(`Received message '${message}', not allowing the connection.`);
      //socket.close();
    }
  });

  socket.on('close', () => { 
    let name = null;
    for (let [key, value] of connectedClients)
    {
      if (value === socket)
      {
        name = key;
        break;
      }
    }
    
    if (name)
    {
      console.log(`'${name}' disconnected`);
      connectedClients.delete(name);
    }
    else
    {
      console.log('A client disconnected');
    }
  });
});


