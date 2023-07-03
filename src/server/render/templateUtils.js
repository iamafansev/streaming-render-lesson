/*
type CollectTemplateOptions = {
  css?: string;
  scriptAssets?: string[];
  content?: string;
};
*/

const CSS_SEARCH_VALUE = '<!-- CSS -->';
const SCRIPTS_SEARCH_VALUE = '<!-- SCRIPTS -->';
const CONTENT_SEARCH_VALUE = '<!-- CONTENT -->';

const buildScriptTag = (src) => `<script type="module" src="${src}"></script>`;

export const splitTemplate = (template) => template.split(CONTENT_SEARCH_VALUE);

export const collectBeginTemplate = (beginTemplate, options) => {
  const { css = '' } = options;
  return beginTemplate.replace(CSS_SEARCH_VALUE, css);
};

const collectContentTemplate = (contentTemplate, { content = '' }) => {
  return contentTemplate.replace(CONTENT_SEARCH_VALUE, content);
};

export const collectEndTemplate = (endTemplate, options) => {
  const { scriptAssets = []} = options;
  const scripts = scriptAssets.map(buildScriptTag).join('');

  return endTemplate.replace(SCRIPTS_SEARCH_VALUE, scripts);
};

export const collectTemplate = (template, options) => {
  return [
    collectBeginTemplate,
    collectContentTemplate,
    collectEndTemplate,
  ].reduce((acc, collect) => collect(acc, options), template);
};