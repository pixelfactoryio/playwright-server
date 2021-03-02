import { ClientRequest, IncomingMessage } from 'http';
import { ServerOptions } from 'http-proxy';
import { Socket } from 'net';
import { Logger } from 'winston';

class LogHandler {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public logReqWs = (proxyReq: ClientRequest, req: IncomingMessage, socket: Socket, options: ServerOptions): void => {
    this.logger.debug(`proxying request from ${socket.remoteAddress}`, {
      req,
      options,
    });
  };
}

export default LogHandler;
