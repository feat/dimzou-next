import get from 'lodash/get';

const templateConfigs = {
  I: {
    coverRatio: 20 / 9,
  },
  II: {
    coverRatio: 20 / 6,
  },
  III: {
    coverRatio: 16 / 8,
  },
  IV: {
    coverRatio: 16 / 9,
  },
  V: {
    coverRatio: 20 / 5,
  },
  CHAPTER: {
    coverRatio: 20 / 8,
  },
};

export function getTemplateCoverRatio(template) {
  if (templateConfigs[template]) {
    return templateConfigs[template].coverRatio;
  }
  return 16 / 9;
}

export function getTemplateCropInfo(rewording, template) {
  if (!rewording) {
    return undefined;
  }

  return get(
    rewording,
    ['template_config', template, 'cropData'],
    get(
      rewording,
      ['template_config', 'templates', template, 'cropData'],
      undefined,
    ),
  );
}
