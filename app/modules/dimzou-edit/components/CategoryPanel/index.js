import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCategoryTree } from '@/modules/category/selectors';
import { asyncCreateCategory } from '@/modules/category/actions';
import Compo from './Compo';

const mapStateToProps = createStructuredSelector({
  tree: selectCategoryTree,
});
const mapDispatchToProps = {
  createCategory: asyncCreateCategory,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Compo);
