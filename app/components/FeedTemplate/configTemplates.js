import random from 'lodash/random';
import {
  FeedTemplateI,
  FeedTemplateIII,
  FeedTemplateV,
  FeedTemplateVII,
  FeedTemplateVIII,
  FeedTemplateIX,
  FeedTemplateX,
  FeedTemplateXI,
  FeedTemplateXII,
  FeedTemplateXIII,
} from './index';

export const templateCountMatrix = [
  [FeedTemplateI, FeedTemplateI.maxItemCount],
  [FeedTemplateIII, FeedTemplateIII.maxItemCount],
  [FeedTemplateV, FeedTemplateV.maxItemCount],
  [FeedTemplateVII, FeedTemplateVII.maxItemCount],
  [FeedTemplateVIII, FeedTemplateVIII.maxItemCount],
  [FeedTemplateIX, FeedTemplateIX.maxItemCount],
  [FeedTemplateX, FeedTemplateX.maxItemCount],
  [FeedTemplateXI, FeedTemplateXI.maxItemCount],
  [FeedTemplateXII, FeedTemplateXII.maxItemCount],
  [FeedTemplateXIII, FeedTemplateXIII.maxItemCount],
];

export const getTemplate = (name) => {
  const target = templateCountMatrix.find(
    (item) => item[0].displayName === name,
  );
  return target && target[0];
};

export const getTemplateCount = (name) => {
  const target = templateCountMatrix.find(
    (item) => item[0].displayName === name,
  );
  return target && target[1];
};

export const getTemplateByCount = (count, minMode = false) => {
  const validItems = templateCountMatrix.filter((item) => item[1] === count);
  const template =
    validItems.length && validItems[random(0, validItems.legnth - 1)][0];
  if (!template && minMode) {
    return getTemplateByCount(count + 1, true);
  }

  return template;
};

export const getRandomTemplate = (min, max = 1000) => {
  const validItems = templateCountMatrix.filter(
    (item) => item[1] >= min && item[1] <= max,
  );
  const validCount = validItems.length;
  return validItems && validItems[random(0, validCount - 1)][0];
};

export default function configTemplates(
  templates = [],
  nextReceivedCount,
  totalCount,
) {
  if (nextReceivedCount <= 0) {
    return templates;
  }
  const templateAmount = templates.reduce(
    (total, next) => total + next.count,
    0,
  );
  if (templateAmount === 0) {
    return configTemplates(
      [{ name: FeedTemplateXIII.displayName, count: 1 }],
      nextReceivedCount - 1,
      totalCount,
    );
  }
  const remainCount = totalCount - templateAmount;

  // lastTemplate
  if (remainCount > 0 && remainCount <= 8) {
    const lastTemplate = getRandomTemplate(remainCount);
    return [
      ...templates,
      { name: lastTemplate.displayName, count: lastTemplate.maxItemCount },
    ];
  }

  // getNextTemplate
  const nexTemplate = getRandomTemplate(2, 10);
  return configTemplates(
    [
      ...templates,
      { name: nexTemplate.displayName, count: nexTemplate.maxItemCount },
    ],
    nextReceivedCount - nexTemplate.maxItemCount,
    totalCount,
  );
}
