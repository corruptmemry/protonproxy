import * as net from 'net';

interface ProxyContext {
  buffers: Buffer[];
  connected: boolean;
  proxySocket: net.Socket;
  serviceSocket?: net.Socket;
}

/**
 * Packet handler class
 *
 * @export
 * @class PacketHandler
 */
export class PacketHandler {
/**
 * Creates an instance of PacketHandler.
 * @memberof PacketHandler
 */
  constructor() {
    // dummy constructor
  }

  /**
 * Handle incoming packet
 *
 * @param {ProxyContext} context
 * @param {Buffer} data
 * @memberof PacketHandler
 */
  incoming(context: ProxyContext, data: Buffer) {
    if (context.proxySocket) {
      context.proxySocket.write(data);
    }
  }

  /**
 * Handle outcoming packet
 *
 * @param {ProxyContext} context
 * @param {Buffer} data
 * @memberof PacketHandler
 */
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
