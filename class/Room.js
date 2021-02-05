import { Game } from "./Game";
import { randMatrix } from 'utils';
import { UserDepartment } from "./";

export class Room {
  name;
  game;
  size = 5;
  winLine = 5;
  user = []; // user's id list;

  constructor({ name, size = 5, winLine = 5, user = [], game, ...props }) {
    this.name = name;
    this.size = size;
    this.user = user;
    this.winLine = winLine;
    if(game) {
      this.game = new Game(size, {...this, game});
    }
    for (const key in props) {
      this[key] = props[key];
    }
  }

  existsUser(userID) {
    return this.user.find(uid => uid === userID);
  }

  invite(user) {
    if(!this.size) throw('not set size');
    if(!this.winLine) throw('not set winLine');

    if(this.existsUser(user.id)) return false;

    if(!user.matrix.length) {
      user.matrix = randMatrix(this.size);
    }

    this.user.push(user.id);
    return true;
  }

  kick(userID) {
    const index = this.user.findIndex(uid => uid === userID);
    if(index === -1) return;
    this.user = [
      ...this.user.slice(0, index),
      ...this.user.slice(index + 1),
    ];
  }

  start() {
    // 應檢查人數與size
    if(!this.size) throw('size');
    if(!this.user.length) throw('user');

    this.user.forEach(id => {
      const user = UserDepartment.user(id);
      if(user?.matrix.length !== this.size ** 2) throw('matrix');
    });
    this.game = new Game(this.size, this);
  }


  backReady() {
    delete this.game;
    const users = this.user.map(UserDepartment.user.bind(UserDepartment));
    console.warn(users);
    users.forEach(user => {
      user.winCount = 0;
      user.matrix = randMatrix(this.size);
    });
  }
}
