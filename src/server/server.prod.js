import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { minify } from 'html-minifier';

import { render } from './render';
import { splitTemplate } from './render/templateUtils';

const PORT = process.env.PORT || 3000;

const dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveFromRoot = (p) => path.resolve(dirname, '..', '..', p);

export const createServer = async () => {
  const template = fs.readFileSync(
    resolveFromRoot('dist/client/src/index.html'),
    'utf-8'
  );
  const minifiedTemplate = minify(template, { collapseWhitespace: true });
  const [beginTemplate, endTemplate] = splitTemplate(minifiedTemplate);

  const app = express();

  app.use((await import('compression')).default());
  app.use(
    (await import('serve-static')).default(resolveFromRoot('dist/client'), {
        index: false,
    })
  );

  app.use('*', async (request, response) => {
    try {
        const html = await render({
            template: {
            full: minifiedTemplate,
                beginTemplate,
                endTemplate,
            },
        });
        console.log(html);

        response.status(StatusCodes.OK).send(html).end();
    } catch (e) {
        response
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .end((e).stack);
    }
  });

  return { app };
};

createServer().then(({ app }) => app.listen(PORT));