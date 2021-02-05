import 'module-alias/register';

import http from 'http';
import cors from 'cors';
import express from 'express';
import socketIO from 'socket.io';

import { Room } from "class";
import { getRandomChar, isExistFile, writeFile  } from "domain/utils";

import {
  RoomHandler,
  GameHandler,
  UserHandler,
  SocketHandler,
} from "./handlers";

const app = express();
const server = http.createServer(app);

const corsOption = {
  // origin: 'https://sexyoung.github.io',
  origin: '*',
};

const io = socketIO(server, {
  cors: corsOption
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/new-room', cors(corsOption), (req, res) => {
  // 直到沒重複才建立
  let name;
  do {
    name = getRandomChar(4);
  } while (isExistFile('room', name));

  const room = new Room({ name });
  writeFile('room', name, room);
  res.json(name);
});

io.on('connection', socket => {
  console.log(`user connect: ${socket.id}`);
  socket.emit("connected", socket.id);

  UserHandler({ io, socket });
  RoomHandler({ io, socket });
  GameHandler({ io, socket });
  SocketHandler({ io, socket });

});

server.listen(4001, () => {
  console.log('listening on *:4001');
});