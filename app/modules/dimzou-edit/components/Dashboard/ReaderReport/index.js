import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import notification from '@feat/feat-ui/lib/notification';
import Button from '@feat/feat-ui/lib/button';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import {
  ReportTable,
  ReportTableHeader,
  ReportTableCell,
  ReportTableRow,
} from '../ReportTable';

import StickyHeaderBlock from '../../StickyHeaderBlock'
import { asyncFetchReaderReport } from '../../../actions';
import { selectReaderReport } from '../../../selectors';
import intlMessages from '../messages';



function ReaderReport() {
  const state = useSelector(selectReaderReport);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!state.data && !state.loading) {
      // FETDH DATA
      dispatch(asyncFetchReaderReport()).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      })
    }
  }, [])

  let content;
  if (state.fetchError) {
    content = (
      <div>
          Error: {state.fetchError.message} 
      </div>
    )
  } else if (state.loading || !state.data) {
    content = (
      <Button type="merge" disabled block>
        <TranslatableMessage message={intlMessages.loadingHint} />
      </Button>
    )
  } else {
    content = state.data && Object.entries(state.data).map(([key, value]) => {
      if (!value.length) {
        return null;
      }
      return (
        <ReportTable key={key}>
          <ReportTableHeader>
            <ReportTableCell modifier="name">
              <TranslatableMessage
                message={intlMessages[`${key}Label`]}
              />
            </ReportTableCell>
            <ReportTableCell modifier="val">
              <TranslatableMessage message={intlMessages.female} />
            </ReportTableCell>
            <ReportTableCell modifier="val">
              <TranslatableMessage message={intlMessages.male} />
            </ReportTableCell>
          </ReportTableHeader>
          {value.sort((a, b) => {
            if (b.title === 'Other') {
              return -1;
            }
            if (a.title === 'Other') {
              return 1;
            }
            return a.title > b.title ? 1 : -1;
          }).map((subUnit, i) => (
            <ReportTableRow key={i}>
              <ReportTableCell modifier="name">
                {subUnit.slug ? (
                  <TranslatableMessage
                    message={{
                      id: `category.${subUnit.slug}`,
                      defaultMessage: subUnit.title,
                    }}
                  />
                ) : subUnit.title}
              </ReportTableCell>
              <ReportTableCell modifier="val">
                {subUnit.female}
              </ReportTableCell>
              <ReportTableCell modifier="val">
                {subUnit.male}
              </ReportTableCell>
            </ReportTableRow>
          ))}
        </ReportTable>
      )
    })
  }
  
    
  return (
    <StickyHeaderBlock
      title={
        <TranslatableMessage message={intlMessages.background} />
      }
      stickyTop='#header'
    >
      {content}
    </StickyHeaderBlock>
  )
    
}

export default ReaderReport;