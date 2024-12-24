import http from "http";
import socketService from "./services/socket";
async function init() {
  const SocketService = new socketService();
  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  SocketService.io.attach(httpServer);

  httpServer.listen(PORT, () =>
    console.log(`HTTP server listening on ${PORT}`)
  );
  socketService.initListeners();
}

init();
