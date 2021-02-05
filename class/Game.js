import { genWinStr, randMatrix } from "domain/utils";
import { RoomDepartment, UserDepartment } from '.';

export class Game {
  winUsers = [];
  turnIndex = 0; // player index?
  checkedList = []; // number[]
  constructor(size, room) {
    this.roomID = room.name;
    if(!room.game) {
      this.winStr = genWinStr(size);
      this.turnIndex = ~~(room.user.length * Math.random());
    } else {
      for (const key in room.game) {
        this[key] = room.game[key];
      }
    }
  }

  checked(num) {
    /**
     * 影響所有玩家的matrix
     * checkedList 也要新增
     */
    if(this.winUsers.length) return;

    if(this.checkedList.includes(num)) {
      throw('exists');
    }

    this.checkedList.push(num);

    const room = RoomDepartment.load(this.roomID);

    const users = room.user.map(UserDepartment.user.bind(UserDepartment));

    users.forEach(user => {
      user.updateWinCount({...this, ...room});
    });

    this.winUsers = users.filter(({ winCount }) => winCount >=  room.winLine);

    if(this.winUsers.length) {
      return this.end(this.winUsers);
    }

    console.warn(
      `= emit = turnNext`,
      users.map(({ id, name, winCount }) => ({
        id,
        name,
        winCount,
      }))
    );

    this.turnIndex = (this.turnIndex + 1) % room.user.length;
  }

  end() {
    console.warn(`= emit = end`, this.winUsers);
  }

  restart() {
    this.winUsers = [];
    this.turnIndex = 0;
    this.checkedList = [];

    const room = RoomDepartment.load(this.roomID);

    const users = room.user.map(UserDepartment.user.bind(UserDepartment));
    users.forEach(user => {
      user.winCount = 0;
      user.matrix = randMatrix(this.room.size);
    });
  }
}