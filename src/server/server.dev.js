import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { createServer as createViteServer } from 'vite';
import { performance } from 'perf_hooks';
import { minify } from 'html-minifier';

import { splitTemplate } from './render/templateUtils';
import { printServerInfo } from './utils/printServerInfo';

if (!globalThis.ssrStartTime) {
    globalThis.ssrStartTime = performance.now();
}

const dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveFromRoot = (p) => path.resolve(dirname, '..', '..', p);

export const createServer = async () => {
    const app = express();
    const vite = await createViteServer();
    const template = fs.readFileSync(resolveFromRoot('src/index.html'), 'utf-8');
    const minifiedTemplate = minify(template, { collapseWhitespace: true });

    app.use(vite.middlewares);
    app.use((await import('compression')).default({ level: 0 }));

    app.use('*', async (request, response) => {
        try {
            const url = request.originalUrl;

            const transformedTemplate = await vite.transformIndexHtml(
                url,
                minifiedTemplate
            );

            const [beginTemplate, endTemplate] = splitTemplate(transformedTemplate);

            const { render } = (await vite.ssrLoadModule('src/server/render'));

            const html = await render({
                template: {
                    full: transformedTemplate,
                    beginTemplate,
                    endTemplate,
                },
            });

            console.log(html);

            response.status(StatusCodes.OK).send(html).end();
        } catch (e) {
        vite.ssrFixStacktrace(e);
        response
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .end((e).stack);
        }
    });

    return { app, vite };
};

createServer().then(({ app, vite }) => {
  const port = process.env.PORT || vite.config.server.port;
  app.listen(port, () =>
    printServerInfo({ viteServer: vite, port: Number(port) })
  );
});