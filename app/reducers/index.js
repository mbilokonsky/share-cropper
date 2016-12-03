import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import lenses from './lenses';
import datasets from './dataset';

const rootReducer = combineReducers({
  counter,
  lenses,
  datasets,
  routing
});

export default rootReducer;
