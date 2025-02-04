
function websocketTest()
{  
  // Replace with your server's IP address if not running locally
  const socket = new WebSocket('ws://localhost:8080');
  
  // Handle connection open
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  // Handle incoming messages
  socket.onmessage = (event) => {
    const messages = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = event.data;
    messages.appendChild(li);
  };
  
  // Handle connection close
  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };
  
  // Handle errors
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  // Send a message to the server
  function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    if (message) {
      socket.send(message);
      input.value = ''; // Clear the input field
    }
  }
}