import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import Layout from '@/components/Layout';
import { withDeviceInfo } from '@/modules/device-info';


const Sidebar = () => (
  <Layout.Sidebar modifier="ads">
    {/* <div>AD PNAEL</div> */}
  </Layout.Sidebar>
);

Sidebar.displayName = 'Sidebar';
Sidebar.propTypes = {
  deviceInfo: PropTypes.shape({
    breakpoint: PropTypes.number,
  }),
};

export default compose(
  withDeviceInfo,
)(Sidebar);
