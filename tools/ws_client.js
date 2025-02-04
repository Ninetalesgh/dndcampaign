
var webSocket = null;
function connectWebsocket(clientName, ip, onOpenFunction, onMessageFunction)
{
  if (webSocket)
  {
    console.log('websocket already connected.');
    return;
  }
  
  webSocket = new WebSocket(`ws://${ip}:8080`);
  
  webSocket.onopen = onOpenFunction;
  webSocket.onmessage = onMessageFunction;

  // Handle connection close
  webSocket.onclose = () => {
    console.log(`Closed WebSocket connection with '${ip}'`);
  };

  // Handle errors
  webSocket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  if (webSocket)
  {
    return true;
  }

  return false;
}

function sendMessageToServer(message) 
{
  if (webSocket && webSocket.readyState === WebSocket.OPEN) 
  {
    webSocket.send(message);
  }
  else
  {
    console.log('Attempted to send message without a WebSocket connection.');
  }
}
