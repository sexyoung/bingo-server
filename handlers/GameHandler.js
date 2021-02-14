import { SocketEvent } from "domain/const";
import { UserDepartment, RoomDepartment } from "class";

const getLineCount = (matrix, checkedList, winStr, size) => {
  const result = checkedList
    .map(num => matrix.findIndex(v => v === num))
    .reduce((result, index) =>
      result.replace(new RegExp(`,${index},`, 'g'), ',,')
    , winStr)
    .match(new RegExp(`${','.repeat(size + 1)}`, 'g'));
  return result ? result.length: 0;
};

export function getGameInfo(room) {
  const winCountList = room.user.map(id => {
    const user = UserDepartment.user(id);
    return {
      id: user.id,
      name: user.name,
      winCount: getLineCount(
        user.matrix,
        room.game.checkedList,
        room.game.winStr,
        room.size,
      )
    };
  });
  const winList = winCountList
    .filter(user => user.winCount >= room.winLine )
    .map(({ name }) => name);

  room.game.winUsers = winList;

  return [
    room.game.checkedList,
    room.user[room.game.turnIndex],
    winCountList,
    room.game.winUsers,
    room.winLine,
  ];
}

export const GameHandler = ({ io, socket }) => {
  const socketID = socket.id;

  /** 取得game資訊 */
  socket.on(SocketEvent.Game.ReqGame, roomID => {
    const room = RoomDepartment.load(roomID);
    /** 取得 user 資料 */
    // 如果此時沒有獲得全部的使用者資訊就會錯誤
    UserDepartment.loadAll();
    const user = UserDepartment.find(socketID);
    io.to(socketID).emit(SocketEvent.User.ResUser, user);

    /** turn */
    // const turnID = room.user[game.turnIndex];
    io.to(socketID).emit(
      SocketEvent.Game.Turn,
      ...getGameInfo(room)
    );
  });
  socket.on(SocketEvent.Game.CheckNum, (roomID, num) => {
    const room = RoomDepartment.room(roomID);
    if(!room.game) return;
    room.game.checkedList = [...new Set(
      [...room.game.checkedList, num]
    )];

    room.game.turnIndex = (room.game.turnIndex + 1) % room.user.length;
    RoomDepartment.save(roomID);

    room.user.forEach(UserDepartment.load.bind(UserDepartment));

    // setTimeout(() => {
      io.in(roomID).emit(
        SocketEvent.Game.Turn,
        ...getGameInfo(room),
      );
    // }, 1500);

  });

  socket.on(SocketEvent.Game.RePlay, roomID => {
    const room = RoomDepartment.load(roomID);
    delete room.game;
    room.user = [];
    RoomDepartment.save(roomID);

    io.in(roomID).emit(
      SocketEvent.Game.GoJoin,
    );
  });
};