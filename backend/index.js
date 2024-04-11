import express from 'express';
import cors from 'cors';
import { EventEmitter } from 'events';
import { WebSocketServer } from 'ws';

const messages = [];
const emitter = new EventEmitter();
const app = express();

app.use(express.json());
app.use(cors());

app.post('/messages', (req, res) => {
  const { message } = req.body;

  messages.push(message);
  emitter.emit('message', message);
  res.status(201).send(message);
});

const server = app.listen(3000, () => {
  console.log('Server run on http://localhost:3000');
});

const wss = new WebSocketServer({ server });

emitter.on('message', (message) => {
  for (const client of wss.clients) {
    client.send(message);
  }
});

wss.on('connection', (connection) => {
  connection.on('message', (message) => {
    const normalizedMessage = message.toString();
    messages.push(normalizedMessage);
    emitter.emit('message', normalizedMessage);
  });
});
