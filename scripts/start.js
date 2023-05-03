import path from "path";
import { fork } from "child_process";
import { fileURLToPath } from "url";
import { buildDev } from "./build.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverChild = fork(path.join(__dirname, "../src/index.js"));

buildDev({ debug: false });

const gracefulShutdown = () => {
  console.info("Gracefully shutting down ...");
  serverChild.kill();
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("exit", gracefulShutdown);
