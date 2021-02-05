import { makeID } from "domain/utils";

export class User {
  id;
  name;
  matrix = [];

  constructor({ name = 'Player', id = makeID(), matrix = [], ...props }) {
    this.id = id;
    this.name = name;
    this.matrix = matrix;
    for (const key in props) {
      this[key] = props[key];
    }
  }

  // 要通知所有房間的人
  sendMessage(message) {
    console.warn(message);
  }

  // 要通知所有房間的人
  rename(name) {
    this.name = name;
  }

  setNum(index, num) {
    if(this.matrix[index]) throw('duplicate');
    this.matrix[index] = num;
  }

  clearMatrix() {
    this.matrix = [];
  }

  updateWinCount({ checkedList, winStr, size }) {
    const result = checkedList
      .map(num => this.matrix.findIndex(v => v === num))
      .reduce((result, index) =>
        result.replace(new RegExp(`,${index},`, 'g'), ',,')
      , winStr)
      .match(new RegExp(`${','.repeat(size + 1)}`, 'g'));
    this.winCount = result ? result.length: 0;
  }
}