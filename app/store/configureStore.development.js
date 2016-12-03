import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';
import rootReducer from '../reducers';
import {getStoredState, persistStore, autoRehydrate} from 'redux-persist';
import {AsyncNodeStorage} from 'redux-persist-node-storage';
import * as counterActions from '../actions/counter';

const actionCreators = {
  ...counterActions,
  push,
};

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

const router = routerMiddleware(hashHistory);

const enhancer = compose(
  applyMiddleware(thunk, router, logger),
  window.devToolsExtension ?
    window.devToolsExtension({ actionCreators }) :
    noop => noop
);

export default function configureStore(storageDirectory, callback) {

  const persistConfig = {whitelist: ['lenses', 'datasets'], storage: new AsyncNodeStorage(storageDirectory)};
  getStoredState(persistConfig, (err, restoredState) => {
    const store = createStore(rootReducer, restoredState, enhancer);
    persistStore(store, persistConfig);

    if (window.devToolsExtension) {
      window.devToolsExtension.updateStore(store);
    }

    if (module.hot) {
      module.hot.accept('../reducers', () =>
        store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
      );
    }

    callback(store);
  });
}
