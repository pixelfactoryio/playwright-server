import ecsFormat from '@elastic/ecs-winston-format';
import { chromium } from 'playwright';
import { createLogger, transports } from 'winston';

import ProxyServer from './Server';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: ecsFormat({ convertReqRes: true }),
  transports: [new transports.Console()],
});

(async (): Promise<void> => {
  const browserServer = await chromium.launchServer();
  const wsEndpoint = browserServer.wsEndpoint();

  const server = new ProxyServer({
    logger,
    wsEndpoint,
    port: Number(process.env.PORT) || 3000,
  });

  server.listen();
})();
