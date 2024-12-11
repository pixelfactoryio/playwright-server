# Playwright Server

## Usage

```bash
docker run -p 3000:3000 pixelfactory/playwright
```

```bash
$ docker run -p 3000:3000 pixelfactory/playwright

{"@timestamp":"2021-03-05T17:51:26.820Z","log.level":"info","message":"chromium server listening on ws://127.0.0.1:44227/8496b4a530c6d5ead24fe7f112fa609d","ecs":{"version":"1.6.0"}}
{"@timestamp":"2021-03-05T17:51:26.832Z","log.level":"info","message":"websocket proxy listening on ws://0.0.0.0:3000","ecs":{"version":"1.6.0"}}
```

Connect to the websocket :

```js
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.connect({ wsEndpoint: 'ws://0.0.0.0:3000/' });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });

  await page.close();
  await context.close();
  await browser.close();
})();
```

## Configuration

### Change browser

By default we start a `chromium` server, but you can choose the browser by passing the environment varialbe `BROWSER_TYPE`.

- Chromium :

```bash
docker run -p 3000:3000 -e BROWSER_TYPE=chromium pixelfactory/playwright
```

- Firefox :

```bash
docker run -p 3000:3000 -e BROWSER_TYPE=firefox pixelfactory/playwright
```

- Webkit :

```bash
docker run -p 3000:3000 -e BROWSER_TYPE=webkit pixelfactory/playwright
```

### Change port

By default the websocket proxy server listen on port `3000`, but you can customize the port using the environment variable `PORT`.

```bash
docker run -p 5000:5000 -e PORT=5000 pixelfactory/playwright
```
