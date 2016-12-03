import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import CreateLensPage from './containers/CreateLensPage';
import CreateDatasetPage from './containers/CreateDatasetPage';
import DatasetEditorPage from './containers/DatasetEditorPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/counter" component={CounterPage} />
    <Route path="/lens" component={CreateLensPage} />
    <Route path="/dataset" component={CreateDatasetPage} />
    <Route path="/editDataset" component={DatasetEditorPage} />
  </Route>
);
