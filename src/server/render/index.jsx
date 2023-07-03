import {renderToString} from 'react-dom/server';

import { collectTemplate } from './templateUtils';
import { App } from '../../client/App';

export const render = async ({template}) => {
    const content = renderToString(<App />);

    const html = collectTemplate(template.full, {content});

    return html;
};
