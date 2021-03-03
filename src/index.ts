import ecsFormat from '@elastic/ecs-winston-format';
import playwright from 'playwright';
import { createLogger, transports } from 'winston';

import ProxyServer from './Server';

const logger = createLogger({
  level: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  format: ecsFormat({ convertReqRes: true }),
  transports: [new transports.Console()],
});

const browserType = (process.env.BROWSER_TYPE as 'chromium' | 'firefox' | 'webkit') || 'chromium';

const healthcheck = async (wsEndpoint: string) => {
  try {
    const browser = await playwright[browserType].connect({ wsEndpoint });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:3000');
    await page.close();
    await context.close();
    await browser.close();
  } catch (e) {
    logger.error(`server healthcheck failed`, { e });
    process.exit(1);
  }
};

(async (): Promise<void> => {
  const browserServer = await playwright[browserType].launchServer();
  const wsEndpoint = browserServer.wsEndpoint();
  healthcheck(wsEndpoint);
  logger.info(`${browserType} server listening on ${wsEndpoint}`);

  const server = new ProxyServer({
    logger,
    wsEndpoint: wsEndpoint,
    port: Number(process.env.PORT) || 3000,
  });
  server.listen();

  const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
  sigs.forEach((sig) => {
    process.on(sig, () => {
      logger.debug(`${sig} signal received.`);
      try {
        server.close(() => {
          logger.info('server stopped');
          process.exit(0);
        });
      } catch (e) {
        logger.error('an error occured while shutting down server', { err: e });
        process.exit(1);
      }
    });
  });
})();
