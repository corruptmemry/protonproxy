import * as fs from "fs";
import * as net from "net";
import * as tls from "tls";
import { proxyOptions } from "@modules/proxyOptions";
import * as log from "@modules/log";
const mcData = require("minecraft-data")("1.18.1");
interface ProxyContext {
  buffers: Buffer[];
  connected: boolean;
  proxySocket: net.Socket;
  serviceSocket?: net.Socket;
}

export class PacketHandler {
  constructor() {}

  incoming(context: ProxyContext, data: Buffer) {
    if (context.proxySocket) {
      context.proxySocket.write(data);
    }
  }

  outcoming(context: ProxyContext, data: Buffer) {
    if (context.serviceSocket) {
      if (context.connected) {
        context.serviceSocket.write(data);
      } else {
        context.buffers[context.buffers.length] = data;
      }
    }
  }
}

export const createHandler = (): PacketHandler => new PacketHandler();
