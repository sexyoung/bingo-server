import { updatePlayer } from '../utils/updatePlayer';
import { SocketEvent } from "domain/const";

import { UserDepartment } from "class";

export const UserHandler = ({ io, socket }) => {
  const socketID = socket.id;
  socket.on(SocketEvent.User.ChangeName, (roomID, newName) => {

    UserDepartment.loadAll();
    const user = UserDepartment.find(socketID);

    if(!user) return;
    user.name = newName;
    UserDepartment.save(user.id);

    /** TODO: 應該可以用 io.in 取代 */
    updatePlayer({
      io,
      id: roomID,
      sockets: [...io.sockets.adapter.rooms.get(roomID)]
    });
  });
};