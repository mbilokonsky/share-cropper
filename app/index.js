import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';
import Path from 'path';
import electron from 'electron'
const app = electron.remote.app;

const store = configureStore(Path.join(app.getPath('home'), '.sharecropper', 'persistence'), (store) => {
  const history = syncHistoryWithStore(hashHistory, store);
  render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>,
    document.getElementById('root')
  );

});
