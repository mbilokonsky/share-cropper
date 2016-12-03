import { connect } from 'react-redux';
import DatasetEditor from '../components/DatasetEditor';

function mapStateToProps(state) {
  return {datasets: state.datasets, lenses: state.lenses};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DatasetEditor);