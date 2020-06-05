'use strict';

const fs = require('fs');
const http = require('http');
const Websocket = require('websocket').server;
const index = fs.readFileSync('./indexServ.html', 'utf8');
const clients = [];
const specArr = [];

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(index);
});

const workWithSpecArr = () => 
{
let n = 1;
for (let i = 0; i < 7; i++) 
{
  specArr[i] = [];
  for (let j = 0; j < 8; j++) 
  {
    specArr[i][j] = 0;
  }
}

for (let j = 0; j < 4; j++) {
  for (let i = 0; i < 4; i++) {
    const a = 0 + i + j;
    const b = 4 + i - j;
    specArr[a ][b] = { num: n, choose: false, cheker: 'null', x: 60 + 120 * i, y: 0 +  120 * j, a, b };
    specArr[a ][b - 1] = { num: n + 4, choose: false, cheker: 'null', x: 0 + 120 * i, y: 60 +  120 * j, a, b: b - 1  };
    n++;
  } n += 4;
}
}

server.listen(8000, () => {
  console.log('Listen port 8000');
});

const ws = new Websocket({
  httpServer: server,
  autoAcceptConnections: false
});  



ws.on('message', (message) => {

    //log the received message and send it back to the client
    console.log('received: ', message);
    ws.send(`Hello, you sent -> ${message}`)
})

ws.on('request', req => {
  workWithSpecArr();


  const connection = req.accept('', req.origin);
  clients.push(connection);
  console.log('Connected ' + connection.remoteAddress);
  connection.on('message', message => {
    const dataName = message.type + 'Data';
    const data = message[dataName];
    const obj = JSON.parse(data);
    console.dir(`X: ${obj.x}, Y : ${obj.y}`);
    console.dir(message);
    console.log('Received: ' + data);
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