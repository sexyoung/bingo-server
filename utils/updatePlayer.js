/** 這檔案遲早要拔 */
import { SocketEvent } from "domain/const";
import { UserDepartment } from "class";

export const updatePlayer = ({io, id, sockets}) => {
  UserDepartment.loadAll();
  io.in(id).emit(
    SocketEvent.Room.PlayerUpdate,
    sockets
      .map(UserDepartment.find.bind(UserDepartment))
      .map(({id, name, matrix}) => ({
        id,
        name,
        percentage: matrix.filter(v => v).length / (matrix.length || 1),
      }))
  );
};