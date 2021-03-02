import { Server, createServer } from 'http';
import { Logger } from 'winston';
import httpServer, { createProxyServer } from 'http-proxy';

import LogHandler from './handlers/Logger';

class ProxyServer {
  public port: number;
  private server: Server;
  private proxy: httpServer;
  private logger: Logger;
  private wsEndpoint: string;

  constructor(config: { port: number; logger: Logger; wsEndpoint: string }) {
    const { port, logger, wsEndpoint } = config;

    this.logger = logger;
    this.port = port;
    this.wsEndpoint = wsEndpoint;

    this.proxy = createProxyServer();

    this.server = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('playwright browser is available at ws://0.0.0.0:3000');
      res.end();
    });

    this.handlers();
  }

  private handlers() {
    this.server.on('upgrade', (req, socket, head) => {
      this.proxy.ws(req, socket, head, { target: this.wsEndpoint, ws: true, ignorePath: true });
    });

    this.proxy.on('proxyReqWs', new LogHandler(this.logger).logReqWs);
  }

  public listen(): void {
    this.logger.info(`websocket listening port ${this.port}`);
    this.server.listen(this.port);
  }
}

export default ProxyServer;
