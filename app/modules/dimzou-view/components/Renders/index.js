import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { RectShape } from '@feat/feat-ui/lib/placeholder';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import { getTemplateCoverRatio } from '@/modules/dimzou-edit/utils/template';
import StickySidebarWithAutoHeight from '@/components/StickySidebarWithAutoHeight';

import styles from './index.module.scss';
import { PUB_TYPE_COLLECTION } from '../../constants';
let lastTemplate = 'I';

const renderPropTypes = {
  sidebarFirst: PropTypes.element,
  sidebarSecond: PropTypes.element,
  cover: PropTypes.string,
  title: PropTypes.element,
  meta: PropTypes.element,
  summary: PropTypes.element,
  content: PropTypes.element,
  footer: PropTypes.element,
  author: PropTypes.element,
  className: PropTypes.string,
};

function RenderI(props) {
  return (
    <div className={classNames(styles.base, styles.I, props.className)}>
      <StickySidebarWithAutoHeight className={styles.sidebarFirst}>
        {props.sidebarFirst}
      </StickySidebarWithAutoHeight>
      <div className={styles.mainContainer}>
        <div className={styles.cover}>
          {props.cover ? (
            <LazyImage src={props.cover} ratio={getTemplateCoverRatio('I')} />
          ) : (
            <RectShape ratio={getTemplateCoverRatio('I')} />
          )}
        </div>
        <div className={styles.mainWrap}>
          <div className={styles.main}>
            <div className={styles.info}>
              {props.title}
              {props.author}
              {props.meta}
              {props.summary}
            </div>
            <div className={classNames(styles.content, 'dz-Typo')}>
              {props.content}
            </div>
            <div className={styles.footer}>{props.footer}</div>
          </div>
          <StickySidebarWithAutoHeight className={styles.sidebarSecond}>
            {props.sidebarSecond}
          </StickySidebarWithAutoHeight>
        </div>
      </div>
    </div>
  );
}

RenderI.propTypes = renderPropTypes;

function RenderII(props) {
  return (
    <div className={classNames(styles.base, styles.II, props.className)}>
      <div className={styles.mainContainer}>
        <div className={styles.cover}>
          {props.cover ? (
            <LazyImage src={props.cover} ratio={getTemplateCoverRatio('II')} />
          ) : (
            <RectShape ratio={getTemplateCoverRatio('II')} />
          )}
        </div>
        <div className={styles.mainWrap}>
          <StickySidebarWithAutoHeight className={styles.sidebarFirst}>
            {props.sidebarFirst}
          </StickySidebarWithAutoHeight>
          <div className={styles.main}>
            <div className={styles.info}>
              {props.title}
              {props.author}
              {props.meta}
              {props.summary}
            </div>
            <div className={classNames(styles.content, 'dz-Typo')}>
              {props.content}
            </div>
            <div className={styles.footer}>{props.footer}</div>
          </div>
          <StickySidebarWithAutoHeight className={styles.sidebarSecond}>
            {props.sidebarSecond}
          </StickySidebarWithAutoHeight>
        </div>
      </div>
    </div>
  );
}

RenderII.propTypes = renderPropTypes;

function RenderIII(props) {
  return (
    <div className={classNames(styles.base, styles.III, props.className)}>
      <div className={styles.header}>
        <div className={styles.info}>
          {props.title}
          {props.author}
          {props.meta}
          {props.summary}
        </div>
        <div className={styles.cover}>
          {props.cover ? (
            <LazyImage src={props.cover} ratio={getTemplateCoverRatio('III')} />
          ) : (
            <RectShape ratio={getTemplateCoverRatio('III')} />
          )}
        </div>
      </div>
      <div className={styles.mainContainer}>
        <StickySidebarWithAutoHeight className={styles.sidebarFirst}>
          {props.sidebarFirst}
        </StickySidebarWithAutoHeight>
        <div className={styles.mainWrap}>
          <div className={styles.main}>
            <div className={classNames(styles.content, 'dz-Typo')}>
              {props.content}
            </div>
            <div className={styles.footer}>{props.footer}</div>
          </div>
        </div>
        <StickySidebarWithAutoHeight className={styles.sidebarSecond}>
          {props.sidebarSecond}
        </StickySidebarWithAutoHeight>
      </div>
    </div>
  );
}
RenderIII.propTypes = renderPropTypes;

function RenderIV(props) {
  return (
    <div className={classNames(styles.base, styles.IV, props.className)}>
      <div className={styles.mainContainer}>
        <StickySidebarWithAutoHeight className={styles.sidebarFirst}>
          {props.sidebarFirst}
        </StickySidebarWithAutoHeight>
        <div className={styles.mainWrap}>
          {props.cover ? (
            <LazyImage src={props.cover} ratio={getTemplateCoverRatio('IV')} />
          ) : (
            <RectShape ratio={getTemplateCoverRatio('IV')} />
          )}
          <div className={styles.main}>
            <div className={styles.info}>
              {props.title}
              {props.author}
              {props.meta}
              {props.summary}
            </div>
            <div className={classNames(styles.content, 'dz-Typo')}>
              {props.content}
            </div>
            <div className={styles.footer}>{props.footer}</div>
          </div>
        </div>
      </div>
      <StickySidebarWithAutoHeight className={styles.sidebarSecond}>
        {props.sidebarSecond}
      </StickySidebarWithAutoHeight>
    </div>
  );
}
RenderIV.propTypes = renderPropTypes;

function RenderV(props) {
  return (
    <div className={classNames(styles.base, styles.V, props.className)}>
      {props.cover ? (
        <LazyImage src={props.cover} ratio={getTemplateCoverRatio('V')} />
      ) : (
        <RectShape ratio={getTemplateCoverRatio('V')} />
      )}
      <div className={styles.mainContainer}>
        <StickySidebarWithAutoHeight className={styles.sidebarFirst}>
          {props.sidebarFirst}
        </StickySidebarWithAutoHeight>
        <div className={styles.mainWrap}>
          <div className={styles.main}>
            <div className={styles.info}>
              {props.title}
              {props.author}
              {props.meta}
              {props.summary}
            </div>
            <div className={classNames(styles.content, 'dz-Typo')}>
              {props.content}
            </div>
            <div className={styles.footer}>{props.footer}</div>
          </div>
        </div>
        <StickySidebarWithAutoHeight className={styles.sidebarSecond}>
          {props.sidebarSecond}
        </StickySidebarWithAutoHeight>
      </div>
    </div>
  );
}
RenderV.propTypes = renderPropTypes;

function RenderCover(props) {
  return (
    <div className={classNames(styles.base, styles.cover, props.className)}>
      <StickySidebarWithAutoHeight className={styles.sidebarFirst}>
        {props.sidebarFirst}
      </StickySidebarWithAutoHeight>
      <div className={styles.mainContainer}>
        <BookCover
          title={props.title}
          cover={props.cover}
          summary={props.summary}
          author={props.author}
        />
      </div>
      <StickySidebarWithAutoHeight className={styles.sidebarSecond}>
        {props.sidebarSecond}
      </StickySidebarWithAutoHeight>
    </div>
  );
}

RenderCover.propTypes = {
  sidebarFirst: PropTypes.element,
  sidebarSecond: PropTypes.element,
  cover: PropTypes.string,
  title: PropTypes.element,
  summary: PropTypes.element,
  author: PropTypes.element,
  className: PropTypes.string,
};

function BookCover(props) {
  const { title, cover, author, summary } = props;
  return (
    <div className={styles.BookCover}>
      {cover && <LazyImage src={cover} ratio={getTemplateCoverRatio('IV')} />}
      <div className={styles.BookCover__base}>{title}</div>
      {summary}
      {author}
    </div>
  );
}

BookCover.propTypes = {
  title: PropTypes.element,
  cover: PropTypes.string,
  author: PropTypes.element,
  summary: PropTypes.element,
};

const renderMap = {
  I: RenderI,
  II: RenderII,
  III: RenderIII,
  IV: RenderIV,
  V: RenderV,
  cover: RenderCover,
};

export function getRender(publication) {
  if (!publication) {
    return renderMap[lastTemplate];
  }
  if (publication.pub_type === PUB_TYPE_COLLECTION) {
    return renderMap.cover;
  }
  lastTemplate = publication.template;
  return renderMap[lastTemplate];
}
