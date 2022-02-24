import * as fs from 'fs';
import * as net from 'net';
import * as tls from 'tls';
import {proxyOptions} from '@modules/proxyOptions';
import * as log from '@modules/log';

interface ProxyContext {
  buffers: Buffer[];
  connected: boolean;
  proxySocket: net.Socket;
  serviceSocket?: net.Socket;
}

export class TcpProxy {
  public server?: net.Server;
  public options: proxyOptions;
  public serviceHosts: string[] = [];
  public servicePorts: number[] = [];
  public serviceHostIndex = -1;
  public proxySockets: { [key: string]: net.Socket } = {};

  constructor(
    public proxyPort: number,
    serviceHost: string | string[],
    servicePort: number | number[],
    options: proxyOptions,
  ) {
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
      if (context.serviceSocket) {
        if (context.connected) {
          context.serviceSocket.write(data);
        } else {
          context.buffers[context.buffers.length] = data;
        }
      }
    });
    proxySocket.on('close', (hadError) => {
      delete this.proxySockets[uniqueKey(proxySocket)];
      if (context.serviceSocket) context.serviceSocket.destroy();
    });
  };
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
        context.proxySocket.write(data);
      });
      context.serviceSocket.on('close', (hadError) => {
        context.proxySocket.destroy();
      });
      context.serviceSocket.on('error', (e) => {
        context.proxySocket.destroy();
      });
    }
  };

  public end() {
    if (this.server) this.server.close();
    for (const key in this.proxySockets) {
      if (key) this.proxySockets[key].destroy();
    }
    if (this.server) this.server.unref();
  }

  protected getServiceHostIndex = () => {
    this.serviceHostIndex++;
    if (this.serviceHostIndex === this.serviceHosts.length) {
      this.serviceHostIndex = 0;
    }
    return this.serviceHostIndex;
  };

  protected writeBuffer(context: ProxyContext) {
    context.connected = true;
    for (const buf of context.buffers) {
      if (context.serviceSocket) context.serviceSocket.write(buf);
    }
  }
  protected counter = 0;
}

function uniqueKey(socket: net.Socket) {
  const key = socket.remoteAddress + ':' + socket.remotePort;
  return key;
}

function parseString(o: string | string[]) {
  if (typeof o === 'string') {
    return o.split(',');
  } else if (Array.isArray(o)) {
    return o;
  } else {
    throw new Error('cannot parse object: ' + o);
  }
}

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
