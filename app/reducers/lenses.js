import { SAVE_LENS } from '../actions/createLens';

export default function lenses(state = {}, action) {
  switch (action.type) {
    case SAVE_LENS:
      let newState = {};
      newState[action.payload.lensName] = action.payload;
      return Object.assign({}, state, newState);
    default:
      return state;
  }
}
