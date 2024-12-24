import { Server } from "socket.io";

class socketService {
  private _io: Server;
  constructor() {
    console.log("Init socket server..");
    this._io = new Server();
  }

  public initListeners() {
    console.log("Initializing socket listeners..");
    const io = this._io;
    io.on("connect", (socket) => {
      console.log("Socket connected", socket.id);
      socket.on(
        "event:sendMessage",
        async ({ message }: { message: string }) => {
          console.log("Received message:", message);
          // io.emit("event:newMessage", { message });
        }
      );
    });
  }
  get io() {
    return this._io;
  }
}

export default socketService;
