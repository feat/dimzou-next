import React from 'react';
import PropTypes from 'prop-types';
import { userFromProfile } from '@/utils/user';

import ViewProfileHeader from '../../ViewProfileHeader';
import ViewAvatarBlock from '../../ViewAvatarBlock';
import ViewOpenTimeSection from '../../ViewOpenTimeSection';
import ViewBasicInfoBlock from '../../ViewBasicInfoBlock';
import ViewServiceTable from '../../ViewServiceTable';
import ViewCareerBlock from '../../ViewCareerBlock';
import ViewEducationBlock from '../../ViewEducationBlock';
import ViewHonorsBlock from '../../ViewHonorsBlock';
import ViewLanguagesBlock from '../../ViewLanguagesBlock';

import './style.scss';

/**
 * Template for missing: workplace
 */
const ViewProfileTypeII = (props) => {
  const {
    profile,
    educations,
    career_experiences: careers,
    languages,
    open_time: openTime,
    expertise,
    honors_awards: honors,
    initOrderCreation,
  } = props;

  const hasCommercialSign = !!profile.commercial_sign;

  return (
    <div className="ViewProfile ViewProfile_II">
      <div className="ViewProfile__header">
        <ViewProfileHeader
          title={profile.commercial_sign || profile.username || profile.uid}
          subTitle={profile.promote_words}
        />
      </div>
      <div className="ViewProfile__content ViewProfileGrid">
        <div className="ViewProfileGrid__cell ViewProfileGrid__cell_basic">
          <ViewAvatarBlock user={userFromProfile(profile)} />
          {!!openTime.open_time && (
            <div className="ViewProfileGrid__cell ViewProfileGrid__cell_openTime">
              <ViewOpenTimeSection data={openTime.open_time} />
            </div>
          )}
          <ViewBasicInfoBlock
            shouldDisplayUsername={hasCommercialSign}
            data={profile}
          />
          {languages &&
            !!languages.length && <ViewLanguagesBlock data={languages} />}
        </div>
        {expertise && !!expertise.length && (
          <div className="ViewProfileGrid__cell ViewProfileGrid__cell_expertise">
            <ViewServiceTable
              data={expertise}
              initOrderCreation={initOrderCreation}
            />
          </div>
        )}
        {!!careers.length && (
          <div className="ViewProfileGrid__cell ViewProfileGrid__cell_career">
            <ViewCareerBlock data={careers} />
          </div>
        )}
        {!!educations.length && (
          <div className="ViewProfileGrid__cell ViewProfileGrid__cell_education">
            <ViewEducationBlock data={educations} />
          </div>
        )}
        {!!honors.length && (
          <div className="ViewProfileGrid__cell ViewProfileGrid__cell_honor">
            <ViewHonorsBlock data={honors} />
          </div>
        )}
      </div>
    </div>
  );
};

ViewProfileTypeII.propTypes = {
  profile: PropTypes.object,
  educations: PropTypes.array,
  career_experiences: PropTypes.array,
  languages: PropTypes.array,
  open_time: PropTypes.object, // TODO
  expertise: PropTypes.array,
  honors_awards: PropTypes.array,
  initOrderCreation: PropTypes.func,
}

export default ViewProfileTypeII;
