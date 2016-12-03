import { SAVE_DATASET } from '../actions/dataset';

export default function dataset(state = {}, action) {
  switch (action.type) {
    case SAVE_DATASET:
      let newState = {};
      newState[action.payload.datasetName] = action.payload;
      return Object.assign({}, state, newState);
    default:
      return state;
  }
}
