import React, { Component, PropTypes } from 'react';
import styles from './CreateDataset.css';
import { Link } from 'react-router';
import Path from 'path';

import electron from 'electron'
const dialog = electron.remote.dialog;



class CreateDataset extends Component {
  constructor() {
    super();
    this.state = {
      datasetName: "",
      lensName: "",
      sourceFolder: ""
    }
  }

  onNameChange = (e) => {
    this.setState({datasetName: e.target.value});
  }

  onLensChange = (e) => {
    this.setState({lensName: e.target.value});
  }

  selectSourceFolder = () => {
    var result = dialog.showOpenDialog({properties: ['openDirectory']}, (result) => {
      this.setState({sourceFolder: result[0]});
    });
  }

  save = () => {
    if (this.state.datasetName === "") {
      return alert("Please name your dataset.");
    }

    if (this.state.lensName === "") {
      return alert("Please choose a lens.");
    }

    if(this.state.sourceFolder === "") {
      return alert("You must choose a source folder, even if it's empty right now.");
    }

    this.props.saveDataset(this.state);
  }

  render() {
    return (<div>
          <h1>Create a Dataset</h1>
          <h3>What would you like to call your dataset?</h3>
          <input
            name="datasetName"
            value={this.state.datasetName}
            onChange={this.onNameChange}
          />

          You can click <Link to="/lens">here</Link> to create more lenses.

          <h3>Which lens would you like to use?</h3>
          <select
            name='lensSelector'
            value={this.state.lensName}
            onChange={this.onLensChange}>
            {
              this.props.lenses.map(lensName => {
                return <option key={lensName} label={lensName} value={lensName} />
              })
            }
          </select>

          <h3>Where are you pulling source images from?</h3>
          <p>This can be empty for now, but it must exist.</p>
          <input disabled value={this.state.sourceFolder} />
          <button onClick={this.selectSourceFolder}>Select Source Folder</button>

          <hr />
          <h3>When you're ready, save your data!</h3>
          <button onClick={this.save}>Save!</button>
        </div>);
  }
}

export default CreateDataset;