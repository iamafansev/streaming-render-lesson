import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';

import { App } from '../../client/app';
import {
  renderToStreamWhenShellReady,
  renderToStreamWhenAllReady,
} from './renderToStream';

export const render = async ({
  url,
  withPrepass,
  template,
  response,
  onError = console.error,
}) => {
  const helmetContext = {
    helmet: {},
  };

  const jsx = (
    <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
            <App />
        </StaticRouter>
    </HelmetProvider>
  );

  const renderToStreamParams = {
    template,
    response,
    jsx,
    onError,
    helmetServerState: helmetContext,
  };

  if (withPrepass) {
    renderToStreamWhenAllReady(renderToStreamParams);
  } else {
    renderToStreamWhenShellReady(renderToStreamParams);
  }
};