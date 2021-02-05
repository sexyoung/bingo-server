import { SocketEvent } from "domain/const";
import { UserDepartment, RoomDepartment } from "class";
import { updatePlayer } from '../utils/updatePlayer';
import { getGameInfo } from './GameHandler';

export const SocketHandler = ({ io, socket }) => {
  const socketID = socket.id;
  socket.on('disconnect', reson => {
    console.log(`==== ${reson} ====\n`, reson, socketID);
    UserDepartment.loadAll();

    const user = UserDepartment.find(socketID);
    if(user) {
      RoomDepartment.loadAll();
      /** 找到使用者在的房間 */
      const roomID = Object.keys(RoomDepartment.data).find(roomID => {
        return RoomDepartment.data[roomID].user.includes(user.id);
      });

      /** 找房 */
      const room = RoomDepartment.room(roomID);
      if(!room) return;

      /** 如果已開始遊戲，要檢查在房人數，turnIndex可能會變 */
      if(room.game) {
        const leaveUserIndex = room.user.indexOf(user.id);
        if(leaveUserIndex < room.game.turnIndex) {
          room.game.turnIndex -= 1;
        } else if(leaveUserIndex === room.user.length - 1) {
          room.game.turnIndex = 0;
        }
      }

      /** 踢出他 */
      room.kick(user.id);

      /** 踢出後再emit turn */
      if(room.game) {
        io.in(roomID).emit(
          SocketEvent.Game.Turn,
          ...getGameInfo(room)
        );
      }

      RoomDepartment.save(roomID);

      // console.warn('socket.adapter.rooms', socket.adapter.rooms);

      // 該使用者的每個聊天室都要移除該使用者
      for (const Room of socket.adapter.rooms) {
        const [id, [...sockets]] = Room;
        /** 這傢伙遲早要改掉 */
        if(!sockets.includes(id))
          updatePlayer({io, id, sockets, size: room.size});
      }
    }
  });
};