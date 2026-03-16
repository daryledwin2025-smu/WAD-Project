// week1 : week1-tools/hello-world-server.js

// Import the built-in 'http module'
const http = require('http');
// Define the hostname and port for the server
const hostname = 'localhost';
const port = 8000;


// Define the server
const server = http.createServer((req, res) => {
  // Set the response header to indicate HTML content
  res.statusCode = 200;
  res.setHeader('Content-Type','text/html');
  // Send the "Hello, World!" message to the browser
  res.end('<h1>Hello, WAD1!</h1>');
});

server.listen(port, hostname, () => {
 console.log(`Server running at http://${hostname}:${port}/`);
});

//test


