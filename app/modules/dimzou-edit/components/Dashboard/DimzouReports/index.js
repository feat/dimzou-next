import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames'

import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import LoadMoreAnchor from '@/components/LoadMoreAnchor';

import intlMessages from '../messages'
import { selectDimzouReports } from '../../../selectors';
import { initCreateChapter, asyncFetchDimzouReportsList } from '../../../actions';
import { BUNDLE_STATUS_PUBLISHED, BUNDLE_TYPE_TRANSLATE } from '../../../constants';
import DimzouReport from './DimzouReport';
import StickyHeaderBlock from '../../StickyHeaderBlock';
import './style.scss';

const fields =  ['location', 'age', 'education', 'industry'];

function DimzouReports() {
  const [field, setField]  =  useState('location');
  const state = useSelector(selectDimzouReports)
  const dispatch = useDispatch();

  const handleFieldClick = useCallback((e) => {
    const btn = e.target.closest('button');
    setField(btn.dataset.field)
  }, [])

  const handleLoadMore = useCallback(() => {
    dispatch(asyncFetchDimzouReportsList());
  }, []);


  useEffect(() => {
    if (!state.onceFetched && !state.loading) {
      handleLoadMore();
    }
  }, [])


  let content;
  if (state.fetchError) {
    content = (
      <div>
        Error: {state.fetchError.message}
      </div>
    )
  } else if (!state.list.length && !state.hasMore) {
    content = (
      <div>
        <TranslatableMessage message={intlMessages.noContentHint} />
        <div className="margin_y_12">
          <Button
            onClick={() => {
              dispatch(initCreateChapter())
            }}
          >
            New Draft
          </Button>
        </div>
      </div>
    )
  } else {
    content = (
      [
        <div className="dz-ReportGrid">
          {state.list
          // .sort((item1, item2) => item2.viewerCount - item1.viewerCount)
            .map(
              (bundle) =>
                bundle && (
                  <div className="dz-ReportGrid__cell" key={bundle.id}>
                    <DimzouReport
                      bundleId={bundle.id}
                      userId={bundle.user_id}
                      statistical={bundle.statistical}
                      title={bundle.title}
                      viewersCount={bundle.viewers_count}
                      isPublished={bundle.status === BUNDLE_STATUS_PUBLISHED}
                      isTranslation={bundle.type === BUNDLE_TYPE_TRANSLATE}
                      statisticalKey={field}
                    />
                  </div>
                ),
            )}
        </div>,
        state.hasMore && (
          <LoadMoreAnchor
            loadMore={handleLoadMore}
            watchScroll={false}
            loading={state.loading}
          />
        ),
      ]
    )
  }


  return (
    <StickyHeaderBlock
      className="dz-DimzouReports"
      title={<TranslatableMessage message={intlMessages.worksStatus} />}
      subHeader={
        <div className="dz-DimzouReports__fields">
          {fields.map((f) => (
            <Button
              type="merge"
              className={classNames({
                'is-selected': f === field,
              })}
              onClick={handleFieldClick}
              data-field={f}
              key={f}
            >
              <TranslatableMessage message={intlMessages[`${f}Label`]} />
            </Button>
          ))}
        </div>
      }
      stickyTop="#header"
      stickyBottomBoundary=".dz-DimzouReports"
    >
      {content}
    </StickyHeaderBlock>
  )
}

export default DimzouReports;