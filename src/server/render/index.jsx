import {renderToString} from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import { collectTemplate } from './templateUtils';
import { App } from '../../client/App';

export const render = async ({url, template}) => {
    const content = renderToString(
        <StaticRouter location={url}>
            <App />
        </StaticRouter>
    );

    const html = collectTemplate(template.full, {content});

    return html;
};
