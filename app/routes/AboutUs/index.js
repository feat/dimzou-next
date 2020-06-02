import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Textfit from 'react-textfit';

import { userFromProfile } from '@/utils/user';

import injectSaga from '@/utils/injectSaga';
import { selectCurrentUser } from '@/modules/auth/selectors';

import Block from '@feat/feat-ui/lib/block';
import SplashView from '@/components/SplashView';
import ViewAvatarBlock from '@/modules/user/components/ViewAvatarBlock';
import ViewBasicInfoBlock from '@/modules/user/components/ViewBasicInfoBlock';
import ViewLanguagesBlock from '@/modules/user/components/ViewLanguagesBlock';
import ViewOpenTimeSection from '@/modules/user/components/ViewOpenTimeSection';
import ViewWorkplaceBlock from '@/modules/user/components/ViewWorkplaceBlock';
import ViewCareerBlock from '@/modules/user/components/ViewCareerBlock';
import ViewEducationBlock from '@/modules/user/components/ViewEducationBlock';
import ViewHonorsBlock from '@/modules/user/components/ViewHonorsBlock';
import EventListBundle from '@/modules/file-x/containers/EventListBundle';
import Event from '@/modules/file-x/containers/Event';

import { REDUCER_KEY } from './reducer';
import saga from './saga';

import { selectPageState } from './selectors';
import { fetchData } from './actions';
import './style.scss';

class AboutUs extends React.PureComponent {
  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    const { pageState } = this.props;
    if (pageState.fetchError) {
      return <div>Error: {pageState.fetchError.message}</div>;
    }
    if (
      pageState.onceFetched &&
      !pageState.loading &&
      !pageState.info &&
      !pageState.post &&
      !pageState.group
    ) {
      return <div>No content</div>;
    }
    if (!pageState.info && !pageState.post) {
      return <SplashView />;
    }

    const {
      info: {
        profile,
        languages,
        open_time: openTime,
        workplace,
        career_experiences: careers,
        educations,
        honors_awards: honors,
      } = {},
      post = {},
    } = pageState;

    return (
      <div className="p-AboutUs">
        <div className="p-AboutUs__main">
          <div className="p-AboutUs__header">
            <Textfit className="t-PageTitle">
              {profile && profile.commercial_sign}
            </Textfit>
          </div>
          <div className="p-AboutUs__mainContent">
            <div className="p-AboutUs__col1">
              <ViewAvatarBlock user={userFromProfile(profile)} />
              <ViewBasicInfoBlock data={profile} />
              <ViewOpenTimeSection data={openTime.open_time} />
              {languages &&
                !!languages.length && <ViewLanguagesBlock data={languages} />}
              <ViewCareerBlock data={careers} />
              <ViewEducationBlock data={educations} />
              <ViewHonorsBlock data={honors} />
            </div>
            <div className="p-AboutUs__col2">
              {post && (
                <Block title={post.terms_text_block.title}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.terms_text_block.content,
                    }}
                  />
                </Block>
              )}
              {workplace && <ViewWorkplaceBlock data={workplace} />}
            </div>
          </div>
        </div>
        <div className="p-AboutUs__filex">
          <EventListBundle
            currentUser={this.props.currentUser}
            userId={profile.uid}
            sort='event_time'
            order='desc'
          >
            {(props) => (
              <>
                <div className="p-AboutUs__header">
                  <Textfit className="t-PageTitle">File-X</Textfit>
                </div>
                <div className="p-AboutUs__filexList">
                  {props.items &&
                    props.items.map((event) => (
                      <Event
                        eventId={event.id}
                        key={event.id}
                        data={event}
                        currentUser={props.currentUser}
                      />
                    ))}
                </div>
              </>
            )}
          </EventListBundle>
        </div>
      </div>
    );
  }
}

AboutUs.propTypes = {
  fetchData: PropTypes.func,
  currentUser: PropTypes.object,
  pageState: PropTypes.shape({
    fetchError: PropTypes.object,
    info: PropTypes.object,
    post: PropTypes.object,
  }),
};

const withSaga = injectSaga({ key: REDUCER_KEY, saga });
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  pageState: selectPageState,
});
const mapDispatchToProps = {
  fetchData,
};
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withSaga,
  withConnect,
)(AboutUs);
