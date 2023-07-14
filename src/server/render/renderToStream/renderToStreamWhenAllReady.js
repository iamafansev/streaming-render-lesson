import { Writable } from 'node:stream';
import { StatusCodes } from 'http-status-codes';
import { renderToPipeableStream } from 'react-dom/server';

import { collectTemplate } from '../templateUtils';

export const renderToStreamWhenAllReady = ({
  jsx,
  response,
  helmetServerState,
  template,
  onError,
}) => {
  let contentHtml = '';
  let didError = false;

  const stream = new Writable({
    write(chunk, _encoding) {
      contentHtml += chunk.toString();
    },
  });

  const { pipe } = renderToPipeableStream(jsx, {
    onAllReady() {
      if (didError) {
        return response.end('<h1>Something went wrong</h1>');
      }

      pipe(stream);

      const html = collectTemplate(template.full, {
        helmetServerState,
        content: contentHtml,
      });

      return response
        .status(StatusCodes.OK)
        .setHeader('content-type', 'text/html')
        .setHeader('Cache-Control', 'no-cache')
        .end(html);
    },
    onShellError() {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR);
    },
    onError(error) {
      didError = true;
      onError(error);
    },
  });
};