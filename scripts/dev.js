import * as fs from "fs";
import path from "path";
import { fork } from "child_process";
import { fileURLToPath } from "url";
import WebSocketServer from "./websocket.js";
import { buildDev } from "./build.js";
import net from "net";
const Socket = net.Socket;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_PORT = process.env.DEV_PORT || 4000;
const PORT = process.env.PORT || 3000;
const server = new WebSocketServer({ port: DEV_PORT });

let serverChild = fork(path.join(__dirname, "../src/index.js"));

const watcher = fs.watch(path.join(__dirname, "../src"), { recursive: true });

const whenServerAvaliable = async (port) => {
  return new Promise((resolve, reject) => {
    const socket = new Socket();

    socket.on("connect", () => resolve());

    socket.on("error", (error) => {
      if (error.code !== "ECONNREFUSED") reject(error);
      else {
        socket.destroy();
        setTimeout(() => {
          whenServerAvaliable(port).then(resolve);
        }, 10);
      }
    });

    socket.connect(port, "0.0.0.0");
  });
};

buildDev();

watcher.on("change", (_, filename) => {
  console.log(`File ${filename} changed`);
  buildDev();
  serverChild.kill();

  whenServerAvaliable(PORT).then(() => {
    console.log("Server restarted");
    server.clients.forEach((client) => {
      client.write(server.createFrame({ message: "RELOAD" }));
    });
  });
  serverChild = fork(path.join(__dirname, "../src/index.js"));
});

server.listen(() => {
  console.log(`Started dev server on port ${DEV_PORT}`);
});

process.on("SIGTERM", () => {
  console.info("Gracefully shutting down");
  serverChild.kill();
});