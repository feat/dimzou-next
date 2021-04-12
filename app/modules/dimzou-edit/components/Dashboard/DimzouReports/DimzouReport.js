import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import Link from 'next/link';
import { Textfit } from 'react-textfit';
import { useIntl } from 'react-intl';
import { maxTextContent } from '@/utils/content';
import Modal from '@feat/feat-ui/lib/modal';
import notification from '@feat/feat-ui/lib/notification';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { ReportTable, ReportTableCell, ReportTableRow } from '../ReportTable';

import intlMessages from '../messages';
import { asyncDeleteBundle } from '../../../actions';
import { getAsPath } from '../../../utils/router';

const valueSort = (a, b) => {
  if (b.title === 'Other') {
    return -1;
  }
  if (a.title === 'Other') {
    return 1;
  }
  return a.title > b.title ? 1 : -1;
};

function DimzouReport(props) {
  const { bundleId, userId, isPublished } = props;
  const data = get(props.statistical, props.statisticalKey, []);
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const { formatMessage } = useIntl();

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      Modal.confirm({
        title: formatMessage(intlMessages.deleteConfirmTitle),
        content: formatMessage(intlMessages.deleteConfirmContent),
        onConfirm: () => {
          setDeleting(true);
          dispatch(
            asyncDeleteBundle({
              bundleId,
              userId,
            }),
          ).catch((err) => {
            notification.error({
              message: 'Error',
              description: err.message,
            });
            setDeleting(false);
          });
        },
        onCancel: () => {},
      });
    },
    [formatMessage],
  );

  const href = {
    pathname: '/dimzou-edit',
    query: {
      pageName: isPublished ? 'view' : 'draft',
      bundleId,
    },
  };
  const asPath = getAsPath(href);

  return (
    <div className="dz-DimzouReport">
      <div className="dz-DimzouReport__header">
        <Link href={href} as={asPath}>
          <a
            className={classNames('dz-DimzouReport__title', {
              'is-draft': !props.isPublished,
            })}
          >
            <Textfit style={{ height: 48 }}>
              {maxTextContent(props.title)}
            </Textfit>
          </a>
        </Link>
        <SquareButton
          size="xs"
          type="dashed"
          className="dz-DimzouReport__action"
          onClick={handleDelete}
          disabled={deleting}
        >
          &times;
        </SquareButton>
      </div>
      <div className="dz-DimzouReport__content">
        <ReportTable>
          <ReportTableRow>
            <ReportTableCell modifier="name">
              <TranslatableMessage message={intlMessages.viewer} />
              <span className="t-highlight">{props.viewersCount}</span>
            </ReportTableCell>
            <ReportTableCell modifier="val">
              <TranslatableMessage message={intlMessages.female} />
            </ReportTableCell>
            <ReportTableCell modifier="val">
              <TranslatableMessage message={intlMessages.male} />
            </ReportTableCell>
          </ReportTableRow>
          {data.sort(valueSort).map((record, i) => (
            <ReportTableRow key={i}>
              <ReportTableCell modifier="name">
                {record.slug ? (
                  <TranslatableMessage
                    message={{
                      id: `category.${record.slug}`,
                      defaultMessage: record.title,
                    }}
                  />
                ) : (
                  record.title
                )}
              </ReportTableCell>
              <ReportTableCell modifier="val">{record.female}</ReportTableCell>
              <ReportTableCell modifier="val">{record.male}</ReportTableCell>
            </ReportTableRow>
          ))}
        </ReportTable>
      </div>
    </div>
  );
}

DimzouReport.propTypes = {
  statistical: PropTypes.object,
  statisticalKey: PropTypes.string,
  viewersCount: PropTypes.number,
  title: PropTypes.string,
  isPublished: PropTypes.bool,
  bundleId: PropTypes.number,
  userId: PropTypes.number,
};

export default DimzouReport;
