import React from 'react';
import PropTypes from 'prop-types';
import { userFromProfile } from '@/utils/user';

import ViewProfileHeader from '../../ViewProfileHeader';
import ViewAvatarBlock from '../../ViewAvatarBlock';
import ViewOpenTimeSection from '../../ViewOpenTimeSection';
import ViewBasicInfoBlock from '../../ViewBasicInfoBlock';
import ViewServiceTable from '../../ViewServiceTable';
import ViewCareerBlock from '../../ViewCareerBlock';
import ViewWorkplaceBlock from '../../ViewWorkplaceBlock';
import ViewEducationBlock from '../../ViewEducationBlock';
import ViewHonorsBlock from '../../ViewHonorsBlock';
import ViewLanguagesBlock from '../../ViewLanguagesBlock';

import './style.scss';

const ViewProfileTypeI = (props) => {
  const {
    profile,
    educations,
    career_experiences: careers,
    languages,
    open_time: openTime,
    expertise,
    workplace,
    honors_awards: honors,
    initOrderCreation,
  } = props;

  const hasCommercialSign = !!profile.commercial_sign;
  const infoBlocks = [];
  if (careers && careers.length) {
    infoBlocks.push(
      <ViewCareerBlock data={careers} />
    );
  }
  if (educations && educations.length) {
    infoBlocks.push(
      <ViewEducationBlock data={educations} />
    )
  }
  if (honors && honors.length) {
    infoBlocks.push(
      <ViewHonorsBlock data={honors} />
    )
  }

  return (
    <div className="ViewProfile ViewProfile_I">
      <div className="ViewProfile__header">
        <ViewProfileHeader
          title={profile.commercial_sign || profile.username || profile.uid}
          subTitle={profile.promote_words}
        />
      </div>
      <div className="ViewProfile__content ViewProfile__row">
        <div className="ViewProfile__col ViewProfile__col_1">
          <ViewAvatarBlock user={userFromProfile(profile)} />
          {openTime.open_time && (
            <ViewOpenTimeSection data={openTime.open_time} />
          )}
          <ViewBasicInfoBlock
            shouldDisplayUsername={hasCommercialSign}
            data={profile}
          />
          {languages && !!languages.length && (
            <ViewLanguagesBlock data={languages} />
          )}
        </div>
        <div className="ViewProfile__col ViewProfile__col_2">
          <div className="ViewProfile__row">
            <div className="ViewProfile__col ViewProfile__col_main">
              <ViewServiceTable
                data={expertise}
                initOrderCreation={initOrderCreation}
              />
              {infoBlocks.shift()}
            </div>
            <div className="ViewProfile__col ViewProfile__col_3">
              <ViewWorkplaceBlock key={workplace.id} data={workplace} />
              {infoBlocks}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewProfileTypeI.propTypes = {
  profile: PropTypes.object,
  educations: PropTypes.array,
  career_experiences: PropTypes.array,
  workplace: PropTypes.object,
  languages: PropTypes.array,
  open_time: PropTypes.object,
  expertise: PropTypes.array,
  honors_awards: PropTypes.array,
  initOrderCreation: PropTypes.func,
}


export default ViewProfileTypeI;
