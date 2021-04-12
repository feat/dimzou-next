/* eslint-disable no-param-reassign */
import { Component } from 'react';
import request, { createInstance } from '@/utils/request';

export default function withApiClient(App) {
  return class Wrapped extends Component {
    static getInitialProps = async (appCtx) => {
      /* istanbul ignore next */
      if (!appCtx) throw new Error('No app context');
      /* istanbul ignore next */
      if (!appCtx.ctx) throw new Error('No page context');
      const isServer = typeof window === 'undefined';

      if (isServer) {
        appCtx.ctx.api = createInstance({
          headers: appCtx.ctx.req.getApiHeaders(),
        });
      } else {
        // TODO config locale;
        appCtx.ctx.api = request;
      }
      let initialProps = {};
      if ('getInitialProps' in App) {
        initialProps = await App.getInitialProps.call(App, appCtx);
      }

      return initialProps;
    };

    render() {
      return <App {...this.props} />;
    }
  };
}
