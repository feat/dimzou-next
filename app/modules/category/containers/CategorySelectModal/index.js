import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CategorySelectModal from '../../components/CategorySelectModal';

import { selectCategoryTree } from '../../selectors';
import { asyncCreateCategory } from '../../actions';

const mapStateToProps = createStructuredSelector({
  tree: selectCategoryTree,
});
const mapDispatchToProps = {
  createCategory: asyncCreateCategory,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategorySelectModal);
