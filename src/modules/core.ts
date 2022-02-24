import * as net from 'net';
import {proxyOptions} from '@modules/proxyOptions';
import * as log from '@modules/log';
import {PacketHandler, createHandler} from '@modules/packet';

interface ProxyContext {
  buffers: Buffer[];
  connected: boolean;
  proxySocket: net.Socket;
  serviceSocket?: net.Socket;
}

/**
 * TCP Proxy class
 */
export class TcpProxy {
  public server?: net.Server;
  public packetHandler: PacketHandler;
  public options: proxyOptions;
  public serviceHosts: string[] = [];
  public servicePorts: number[] = [];
  public serviceHostIndex = -1;
  public proxySockets: { [key: string]: net.Socket } = {};

  /**
 * Creates an instance of TcpProxy.
 * @param {number} proxyPort
 * @param {(string | string[])} serviceHost
 * @param {(number | number[])} servicePort
 * @param {proxyOptions} options
 * @memberof TcpProxy
 */
  constructor(
    public proxyPort: number,
    serviceHost: string | string[],
    servicePort: number | number[],
    options: proxyOptions,
  ) {
    this.packetHandler = createHandler();
    this.options = options;
    this.serviceHosts = parseString(serviceHost);
    this.servicePorts = parseNumber(servicePort);
    this.createListener();
  }
  protected createListener = () => {
    this.server = net.createServer((socket) => {
      this.handleClient(socket);
    });
    this.server.listen(this.proxyPort, this.options.hostname, () =>
      log.info(
          'Listening on ' +
          (this.options.hostname ? this.options.hostname : '0.0.0.0') +
          ':' +
          this.proxyPort +
          ' while proxying ' +
          this.serviceHosts.toString() +
          ':' +
          this.servicePorts.toString(),
      ),
    );
  };

  /**
 * Handle local client
 *
 * @protected
 * @param {net.Socket} proxySocket
 * @memberof TcpProxy
 */
  protected handleClient = (proxySocket: net.Socket) => {
    const key = uniqueKey(proxySocket);
    this.proxySockets[key] = proxySocket;
    const context: ProxyContext = {
      buffers: [],
      connected: false,
      proxySocket,
    };
    this.createServiceSocket(context);
    proxySocket.on('data', (data) => {
      this.packetHandler.outcoming(context, data);
    });
    proxySocket.on('close', (hadError) => {
      delete this.proxySockets[uniqueKey(proxySocket)];
      if (context.serviceSocket) context.serviceSocket.destroy();
      if (hadError) log.error('An error happened');
    });
  };

  /**
 * Create service socket
 *
 * @protected
 * @param {ProxyContext} context
 * @memberof TcpProxy
 */
  protected createServiceSocket = (context: ProxyContext) => {
    const i = this.getServiceHostIndex();
    context.serviceSocket = new net.Socket();
    context.serviceSocket.connect(
        this.servicePorts[i],
        this.serviceHosts[i],
        () => {
          this.writeBuffer(context);
        },
    );
    if (context.serviceSocket) {
      context.serviceSocket.on('data', (data) => {
        this.packetHandler.incoming(context, data);
      });
      context.serviceSocket.on('close', (hadError) => {
        context.proxySocket.destroy();
        if (hadError) log.error('An error happened');
      });
      context.serviceSocket.on('error', (e) => {
        context.proxySocket.destroy();
        log.error('An error happened: ' + e.message);
      });
    }
  };


  /**
 * End all connections
 *
 * @memberof TcpProxy
 */
  public end() {
    if (this.server) this.server.close();
    for (const key in this.proxySockets) {
      if (key) this.proxySockets[key].destroy();
    }
    if (this.server) this.server.unref();
  }

  /**
   * Get service host index
   *
   * @protected
   * @memberof TcpProxy
   * @return {number}
   */
  protected getServiceHostIndex = () => {
    this.serviceHostIndex++;
    if (this.serviceHostIndex === this.serviceHosts.length) {
      this.serviceHostIndex = 0;
    }
    return this.serviceHostIndex;
  };

  /**
 * Write buffer
 *
 * @protected
 * @param {ProxyContext} context
 * @memberof TcpProxy
 */
  protected writeBuffer(context: ProxyContext) {
    context.connected = true;
    for (const buf of context.buffers) {
      if (context.serviceSocket) context.serviceSocket.write(buf);
    }
  }
  protected counter = 0;
}

/**
 * Generate a unique key
 *
 * @param {net.Socket} socket
 * @return {string}
 */
function uniqueKey(socket: net.Socket) {
  const key: string = socket.remoteAddress + ':' + socket.remotePort;
  return key;
}

/**
 * Parse string
 *
 * @param {(string | string[])} o
 * @return {*}
 */
function parseString(o: string | string[]) {
  if (typeof o === 'string') {
    return o.split(',');
  } else if (Array.isArray(o)) {
    return o;
  } else {
    throw new Error('cannot parse object: ' + o);
  }
}

/**
 * Parse number
 *
 * @param {(string | number | number[])} o
 * @return {*}
 */
function parseNumber(o: string | number | number[]) {
  if (typeof o === 'string') {
    return o.split(',').map((value) => parseInt(value, 10));
  } else if (typeof o === 'number') {
    return [o];
  } else if (Array.isArray(o)) {
    return o;
  } else {
    throw new Error('cannot parse object: ' + o);
  }
}
