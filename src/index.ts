import ecsFormat from '@elastic/ecs-winston-format';
import playwright from 'playwright';
import { createLogger, transports } from 'winston';

import ProxyServer from './Server';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: ecsFormat({ convertReqRes: true }),
  transports: [new transports.Console()],
});

let browserType = process.env.BROWSER_TYPE || 'chromium';

const startBrowserServer = async (type: string): Promise<playwright.BrowserServer> => {
  switch (type) {
    case 'chromium': {
      return playwright['chromium'].launchServer();
    }
    case 'firefox': {
      return playwright['firefox'].launchServer();
    }
    case 'webkit': {
      return playwright['webkit'].launchServer();
    }
    default: {
      logger.error(`unkown browserType ${browserType}, defaulting to chromium`);
      browserType = 'chromium';
      break;
    }
  }
  return playwright['chromium'].launchServer();
};

(async (): Promise<void> => {
  const browserServer = await startBrowserServer(browserType);
  const wsEndpoint = browserServer.wsEndpoint();
  logger.info(`starting ${browserType} browser server ${wsEndpoint}`);

  const server = new ProxyServer({
    logger,
    wsEndpoint,
    port: Number(process.env.PORT) || 3000,
  });

  logger.info(`starting websocket proxy on port ${server.port}`);
  server.listen();
})();
