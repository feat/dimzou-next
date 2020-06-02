import React from 'react';

import Basic from './Basic';
import codeBlockRaw from './data/code-block';
import articleRaw from './data/article';
import articleHtml from './data/article.html';

import codeBlockHtml from './data/code-block.html';


import './styles/basic.scss';

export default {
  title: 'FeatEditor Basic',
  component: null,
};

export const Aritcle = () => <Basic data={articleRaw} />;

export const ArticleHTML = () => <Basic html={articleHtml} />;

export const CodeBlock = () => <Basic data={codeBlockRaw} />;

export const CodeBlockHTML = () => <Basic html={codeBlockHtml} />;
