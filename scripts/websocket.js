// Implement Websocket Server from scratch

import http from "http";
import crypto from "crypto";
import { EventEmitter } from "events";

class WebSocketServer extends EventEmitter {
  constructor(options = {}) {
    super();
    this.clients = new Set();
    this.port = options.port || 8080;
    this.GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    this.OPCODES = { text: 0x01, close: 0x08 };
    this._init();
  }

  parseFrame(buffer) {
    const firstByte = buffer.readUInt8(0);
    const opCode = firstByte & 0b00001111;

    if (opCode === this.OPCODES.close) {
      this.emit("close");
      return null;
    } else if (opCode !== this.OPCODES.text) {
      return;
    }

    const secondByte = buffer.readUInt8(1);

    let offset = 2;
    let payloadLength = secondByte & 0b01111111;

    if (payloadLength === 126) {
      offset += 2;
    } else if (payloadLength === 127) {
      offset += 8;
    }

    const isMasked = Boolean((secondByte >>> 7) & 0x1);

    if (isMasked) {
      const maskingKey = buffer.readUInt32BE(offset);
      offset += 4;
      const payload = buffer.subarray(offset);
      const result = this._unmask(payload, maskingKey);
      return result.toString("utf-8");
    }

    return buffer.subarray(offset).toString("utf-8");
  }

  createFrame(data) {
    const payload = JSON.stringify(data);

    const payloadByteLength = Buffer.byteLength(payload);
    let payloadBytesOffset = 2;
    let payloadLength = payloadByteLength;

    if (payloadByteLength > 65535) {
      // length value cannot fit in 2 bytes
      payloadBytesOffset += 8;
      payloadLength = 127;
    } else if (payloadByteLength > 125) {
      payloadBytesOffset += 2;
      payloadLength = 126;
    }

    const buffer = Buffer.alloc(payloadBytesOffset + payloadByteLength);

    buffer.writeUInt8(0b10000001, 0);

    buffer[1] = payloadLength;

    if (payloadLength === 126) {
      buffer.writeUInt16BE(payloadByteLength, 2);
    } else if (payloadByteLength === 127) {
      buffer.writeBigUInt64BE(BigInt(payloadByteLength), 2);
    }

    buffer.write(payload, payloadBytesOffset);
    return buffer;
  }

  listen(callback) {
    this._server.listen(this.port, callback);
  }

  _init() {
    if (this._server) throw new Error("Server already initialized");

    this._server = http.createServer((req, res) => {
      const UPGRADE_REQUIRED = 426;
      const body = http.STATUS_CODES[UPGRADE_REQUIRED];
      res.writeHead(UPGRADE_REQUIRED, {
        "Content-Type": "text/plain",
        Upgrade: "WebSocket",
      });
      res.end(body);
    });

    this._server.on("upgrade", (req, socket) => {
      this.emit("headers", req);

      if (req.headers.upgrade !== "websocket") {
        socket.end("HTTP/1.1 400 Bad Request");
        return;
      }

      const acceptKey = req.headers["sec-websocket-key"];
      const acceptValue = this._generateAcceptValue(acceptKey);

      const responseHeaders = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${acceptValue}`,
      ];

      this.clients.add(socket);
      socket.write(responseHeaders.concat("\r\n").join("\r\n"));

      socket.on("data", (buffer) =>
        this.emit("data", this.parseFrame(buffer), (data) =>
          socket.write(this.createFrame(data))
        )
      );

      this.on("close", () => {
        this.clients.delete(socket);
        socket.destroy();
      });
    });
  }

  _generateAcceptValue(acceptKey) {
    return crypto
      .createHash("sha1")
      .update(acceptKey + this.GUID, "binary")
      .digest("base64");
  }

  _unmask(payload, maskingKey) {
    const result = Buffer.alloc(payload.byteLength);

    for (let i = 0; i < payload.byteLength; ++i) {
      const j = i % 4;
      const maskingKeyByteShift = j === 3 ? 0 : (3 - j) << 3;
      const maskingKeyByte =
        (maskingKeyByteShift === 0
          ? maskingKey
          : maskingKey >>> maskingKeyByteShift) & 0b11111111;
      const transformedByte = maskingKeyByte ^ payload.readUInt8(i);
      result.writeUInt8(transformedByte, i);
    }

    return result;
  }
}

export default WebSocketServer;
