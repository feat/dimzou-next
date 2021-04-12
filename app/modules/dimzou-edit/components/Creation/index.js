import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import Head from 'next/head';

import notification from '@feat/feat-ui/lib/notification';
import { selectCurrentUser } from '@/modules/auth/selectors';
import { concatHeaders } from '@/utils/router';

import { OwnerContext } from '../../context';

import ChapterNodeCreation from '../ChapterNodeCreation';
import CoverNodeCreation from '../CoverNodeCreation';
import WorkshopContextProvider from '../../providers/WorkshopContextProvider';
import { asyncCreateBundle } from '../../actions';
import { getTemplate } from '../../utils/workspace';

import {
  createPlaceholders,
  createCoverPlaceholders,
  pageTitle,
} from '../../messages';

function Creation(props) {
  const {
    type,
    intl: { formatMessage },
  } = props;
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  if (type === 'cover') {
    return (
      <div className="dz-App">
        <Head>
          <title>{concatHeaders(formatMessage(pageTitle.createCover))}</title>
        </Head>
        <OwnerContext.Provider value={currentUser}>
          <WorkshopContextProvider>
            <CoverNodeCreation
              cacheKey="dimzou-bundle.new"
              onSubmit={(data) =>
                dispatch(
                  asyncCreateBundle({
                    ...data,
                    isMultiChapter: true,
                  }),
                ).catch((err) => {
                  notification.error({
                    message: 'Error',
                    description: err.message,
                  });
                })
              }
              titlePlaceholder={formatMessage(createCoverPlaceholders.title)}
              summaryPlaceholder={formatMessage(
                createCoverPlaceholders.summary,
              )}
            />
          </WorkshopContextProvider>
        </OwnerContext.Provider>
      </div>
    );
  }
  return (
    <div className="dz-App">
      <Head>
        <title>{concatHeaders(formatMessage(pageTitle.createPage))}</title>
      </Head>
      <OwnerContext.Provider value={currentUser}>
        <WorkshopContextProvider>
          <ChapterNodeCreation
            currentUser={currentUser}
            defaultTemplate={getTemplate()}
            cacheKey="dimzou-bundle.new"
            titlePlaceholder={formatMessage(createPlaceholders.title)}
            summaryPlaceholder={formatMessage(createPlaceholders.summary)}
            contentPlaceholder={formatMessage(createPlaceholders.content)}
            canCancel={false}
            // canCancel={!workspace.isCreate}
            // onCancel={() => {
            //   Router.go(-1);
            // }}
            onSubmit={(data) => dispatch(asyncCreateBundle(data))}
          />
        </WorkshopContextProvider>
      </OwnerContext.Provider>
    </div>
  );
}

Creation.propTypes = {
  type: PropTypes.oneOf(['page', 'cover']),
  intl: PropTypes.object,
};

export default injectIntl(Creation);
