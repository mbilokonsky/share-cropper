import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateDataset from '../components/CreateDataset';
import * as ac from '../actions/dataset';

function mapStateToProps(state) {
  return {lenses: Object.keys(state.lenses)};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ac, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateDataset);