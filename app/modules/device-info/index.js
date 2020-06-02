import React from 'react';
import PropTypes from 'prop-types';
// import throttle from 'lodash/throttle';
import { MQLManager } from 'react-mql-manager';
// import { Provider, MediaQueriesRenderProps } from 'react-mql-manager';

export const deviceTypes = {
  SMARTPHONE: 'smartphone',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
};

export const SCREEN_XS_MIN = 576;
export const SCREEN_SM_MIN = 768;
export const SCREEN_MD_MIN = 992;
export const SCREEN_LG_MIN = 1150;
export const SCREEN_XL_MIN = 1440;
export const SCREEN_XXL_MIN = 1920;

export const breakpointMap = {
  // desktop
  extremeLarge: `(min-width: ${SCREEN_XXL_MIN}px)`,
  extraLarge: `(min-width: ${SCREEN_XL_MIN}px) and (max-width: ${SCREEN_XXL_MIN}px)`,
  large: `(min-width: ${SCREEN_LG_MIN}px) and (max-width: ${SCREEN_XL_MIN}px)`,
  // tablet
  medium: `(min-width: ${SCREEN_MD_MIN}px) and (max-width: ${SCREEN_LG_MIN}px)`,
  small: `(min-width: ${SCREEN_SM_MIN}px) and (max-width: ${SCREEN_MD_MIN}px)`,
  // smartphone
  extraSmall: `(max-width: ${SCREEN_SM_MIN}px)`,
};

let media;

export function isMobile() {
  return media && media.extraSmall;
}

export function isTablet() {
  return media && (media.medium || media.small);
}

const DeviceInfo = React.createContext();

export default class DeviceInfoProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    if (process.browser) {
      this.handleChange = this.handleChange.bind(this);
      this.MQLManager = new MQLManager({
        queries: breakpointMap,
        onChange: this.handleChange,
        debounce: 1000,
        parentMounted: false,
      });
      this.state = this.MQLManager.getMatchState();
      this.updateBodyClassname();
      media = this.state;
    } else {
      // TODO: default media query
      this.state = {}
    }
  }

  componentDidMount() {
    if (process.browser) {
      this.MQLManager.addListeners();
    }
  }

  componentWillUnmount() {
    if (process.browser) {
      this.MQLManager.removeListeners();
    }
  }

  updateBodyClassname() {
    // isMobile
    if (this.state.extraSmall) {
      document.body.classList.add('__mobile__');
    } else {
      document.body.classList.remove('__mobile__');
    }
  }

  handleChange = (info) => {
    media = info;
    this.setState(info, this.updateBodyClassname);
  };

  render() {
    return (
      <DeviceInfo.Provider value={{ media: this.state }}>
        {this.props.children}
      </DeviceInfo.Provider>
    );
  }
}

DeviceInfoProvider.propTypes = {
  children: PropTypes.node,
};

export function withDeviceInfo(Compo) {
  const originName = Compo.displayName || Compo.name;
  function WrapperComponent(props) {
    return (
      <DeviceInfo.Consumer>
        {({ media: mediaInfo }) => (
          <Compo
            {...props}
            isMobile={mediaInfo.extraSmall}
            isTablet={mediaInfo.medium || mediaInfo.small}
            isDesktop={
              mediaInfo.extremeLarge || mediaInfo.extraLarge || mediaInfo.large
            }
          />
        )}
      </DeviceInfo.Consumer>
    );
  }
  WrapperComponent.displayName = `withDeviceInfo(${originName})`;
  return WrapperComponent;
}
