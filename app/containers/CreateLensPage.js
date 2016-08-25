import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateLens from '../components/CreateLens';
import * as CreateLensActions from '../actions/createLens';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CreateLensActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateLens);
