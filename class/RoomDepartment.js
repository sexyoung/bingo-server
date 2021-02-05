import fs from 'fs';
import { Room } from "./";
import { readFile, writeFile, isExistFile } from "domain/utils";

let instance = null;

class RoomDepartmentSingleton {
  data = {};
  constructor() {
    if(!instance) {
      instance = this;
    }
    return instance;
  }

  new(room) {
    this.data[room.name] = room;
    return room;
  }

  find(socketID) {
    const idList = Object.keys(this.data);
    return idList.find(id => {
      return this.data[id].socketID === socketID;
    });
  }

  room(roomID) {
    return this.data[roomID];
  }

  load(roomID) {
    if(!isExistFile('room', roomID)) return;
    return this.data[roomID] = new Room(readFile('room', roomID));
  }

  loadAll() {
    const roomList = fs.readdirSync('./server/data/room');
    this.data = roomList.reduce((obj, file) => ({
      ...obj,
      [file.slice(0, -5)]: new Room(readFile('room', file.slice(0, -5)))
    }),{});
  }

  save(roomID) {
    delete this.data[roomID].game?.room;
    writeFile('room', roomID, this.data[roomID]);
  }
}

export const RoomDepartment = new RoomDepartmentSingleton();