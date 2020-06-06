'use strict';

const fs = require('fs');
const http = require('http');
const Websocket = require('websocket').server;
const index = fs.readFileSync('./indexServ.html', 'utf8');
const clients = [];
//const specArr = [];

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(index);
});



server.listen(8080, () => {
  console.log('Listen port 8080');
});

const ws = new Websocket({
  httpServer: server,
  autoAcceptConnections: false
});



ws.on('message', message => {

  //log the received message and send it back to the client
  console.log('received: ', message);
  ws.send(`Hello, you sent -> ${message}`);
});

ws.on('request', req => {
  // workWithSpecArr();


  const connection = req.accept('', req.origin);
  clients.push(connection);
  console.log('Connected ' + connection.remoteAddress);
  connection.on('message', message => {
    const dataName = message.type + 'Data';
    const data = message[dataName];
    // const obj = JSON.parse(data);
    //  console.dir(`X: ${obj.x}, Y : ${obj.y}`);
    //   console.dir(message);
    // console.log('Received: ' + data);
    clients.forEach(client => {
      if (connection !== client) {
        client.send(data);
      }
    });
  });
  connection.on('close', (reasonCode, description) => {
    console.log('Disconnected ' + connection.remoteAddress);
    console.dir({ reasonCode, description });
  });
});
