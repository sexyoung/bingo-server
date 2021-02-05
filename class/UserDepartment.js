import fs from 'fs';
import { User } from "./";
import { readFile, writeFile, isExistFile } from "utils";

let instance = null;

class UserDepartmentSingleton {
  data = {};
  constructor() {
    if(!instance) {
      instance = this;
    }
    return instance;
  }

  new(user) {
    this.data[user.id] = user;
    return user;
  }

  find(socketID) {
    const idList = Object.keys(this.data);
    const id = idList.find(id =>
      this.data[id].socketID === socketID
    );

    return this.data[id];
  }

  user(id) {
    return this.data[id];
  }

  load(userID) {
    if(!isExistFile('user', userID)) return;
    return this.data[userID] = new User(readFile('user', userID));
  }

  loadAll() {
    const userList = fs.readdirSync('./data/user');
    this.data = userList.reduce((obj, file) => ({
      ...obj,
      [file.slice(0, -5)]: new User(readFile('user', file.slice(0, -5)))
    }),{});
  }

  save(userID) {
    writeFile('user', userID, this.data[userID]);
  }
}

export const UserDepartment = new UserDepartmentSingleton();