import React from 'react';

import PropTypes from 'prop-types';
import { userFromProfile } from '@/utils/user';

import ViewProfileHeader from '../../ViewProfileHeader';
import ViewAvatarBlock from '../../ViewAvatarBlock';
import ViewOpenTimeSection from '../../ViewOpenTimeSection';
import ViewBasicInfoBlock from '../../ViewBasicInfoBlock';
import ViewSimpleExpertise from '../../ViewSimpleExpertise';
import ViewCareerBlock from '../../ViewCareerBlock';
import ViewEducationBlock from '../../ViewEducationBlock';
import ViewHonorsBlock from '../../ViewHonorsBlock';
import ViewLanguagesBlock from '../../ViewLanguagesBlock';
import ViewWorkplaceBlock from '../../ViewWorkplaceBlock';

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
    workplace,
  } = props;

  const hasCommercialSign = !!profile.commercial_sign;

  return (
    <div className="ViewProfile ViewProfile_III">
      <div className="ViewProfile__header">
        <ViewProfileHeader
          title={profile.commercial_sign || profile.username || profile.uid}
          subTitle={profile.promote_words}
        />
      </div>
      <div className="ViewProfile__content ViewProfile__row">
        <div className="ViewProfile__col ViewProfile__col_1">
          <ViewAvatarBlock user={userFromProfile(profile)} />
          {!!openTime.open_time && (
            <ViewOpenTimeSection data={openTime.open_time} />
          )}
          <ViewBasicInfoBlock
            shouldDisplayUsername={hasCommercialSign}
            data={profile}
          />
          {languages &&
            !!languages.length && <ViewLanguagesBlock data={languages} />}
        </div>
        <div className="ViewProfile__col ViewProfile__col_2">
          <div className="ViewProfile__row ViewProfile__row_wrap">
            <div className="ViewProfile__col ViewProfile__col_3">
              <ViewSimpleExpertise
                data={expertise}
                initOrderCreation={initOrderCreation}
              />
            </div>
            {workplace && (
              <div className="ViewProfile__col ViewProfile__col_3">
                <ViewWorkplaceBlock key={workplace.id} data={workplace} />
              </div>
            )}
            {!!careers.length && (
              <div className="ViewProfile__col ViewProfile__col_3">
                <ViewCareerBlock data={careers} />
              </div>
            )}
            {!!educations.length && (
              <div className="ViewProfile__col ViewProfile__col_3">
                <ViewEducationBlock data={educations} />
              </div>
            )}
            {!!honors.length && (
              <div className="ViewProfile__col ViewProfile__col_3">
                <ViewHonorsBlock data={honors} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ViewProfileTypeII.propTypes = {
  profile: PropTypes.object,
  workplace: PropTypes.object,
  educations: PropTypes.array,
  career_experiences: PropTypes.array,
  languages: PropTypes.array,
  open_time: PropTypes.object, // TODO
  expertise: PropTypes.array,
  honors_awards: PropTypes.array,
  initOrderCreation: PropTypes.func,
}

export default ViewProfileTypeII;
