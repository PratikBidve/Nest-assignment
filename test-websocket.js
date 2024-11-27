const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlByYXRlZWtCaWR2ZSIsInN1YiI6MSwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI3MTI0NzQsImV4cCI6MTczMjcxNjA3NH0.wXnAmFkKlt47JZ464uFPV_v1wvnBHy9ef7giQD2yhVk', // Replace with a valid JWT
  },
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('workflow-update', (data) => {
  console.log('Workflow update received:', data);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from server:', reason);
});

// Test sending a message
socket.emit('workflow-status', { workflowId: 1 }, (response) => {
  console.log('Workflow status response:', response);
});
