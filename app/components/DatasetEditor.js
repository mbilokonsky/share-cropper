import React, { Component, PropTypes } from 'react';
import styles from './DatasetEditor.css';
import { Link } from 'react-router';
import Path from 'path';
import fs from 'fs';
import Cropper from './Cropper';

import electron from 'electron'
const dialog = electron.remote.dialog;

class DatasetEditor extends Component {
  constructor() {
    super();
    this.state = {
      dataset: {
        datasetName: '',
        sourceFolder: ''
      },
      currentImage: '',
      currentIndex: 0,
      files: []
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.advance === true) {
      console.log("Advancing state!");
      this.advance(nextState.dataset, nextState.currentIndex);
    }
  }

  getOutputFilename = () => {
    return "/Users/mykola/.sharecropper/datasets/" + this.state.dataset.datasetName + "_" + this.state.dataset.lensName + "/" + this.state.currentImage.split('.')[0] + ".png";
  }

  moveCurrentImage = (folder) => {
    var sourcePath = Path.join(this.state.dataset.sourceFolder, this.state.currentImage);
    var targetPath = Path.join(this.state.dataset.sourceFolder, folder, this.state.currentImage);
    let dir = Path.parse(targetPath).dir;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.renameSync(sourcePath, targetPath);
    this.setState({advance: true});
  }

  advance = (dataset, index) => {
    if (dataset.sourceFolder === "") {
      console.log("No source folder", dataset);
      return;
    }

    let files = this.getFiles(dataset.sourceFolder);
    let currentIndex = index || 0;
    if (currentIndex >= files.length) {
      currentIndex = files.length - 1;
    }

    let imagesCompleted = this.getFiles(dataset.sourceFolder + "/complete").length;
    let imagesSkipped = this.getFiles(dataset.sourceFolder + "/skip").length;

    let currentImage = files[currentIndex];
    this.setState({currentIndex, currentImage, files, advance: false, imagesToDo: files.length, imagesCompleted, imagesSkipped});
  }

  confirmSaveDirectoryExists = (filename) => {
    let folder = Path.parse(filename).dir;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  }

  saveSnapshot = (buffer) => {
    let filename = this.getOutputFilename();
    this.confirmSaveDirectoryExists(filename);
    console.log("Saving image", filename);

    fs.writeFileSync(filename, buffer);
    this.moveCurrentImage('complete');
    this.setState({advance: true});
  }

  skipImage = () => {
    console.log("Skipping image!");
    this.moveCurrentImage('skip');
    this.setState({advance: true});
  }

  onDatasetChange = (e) => {
    this.setDataset(this.props.datasets[e.target.value]);
  }

  setDataset = (dataset) => {
    this.setState({dataset: dataset, currentIndex: 0, advance: true});
  }

  getFiles = (src) => {
    return fs.readdirSync(src) || [];
  }

  imageClicked = (e) => {
    let currentImage = e.target.innerText;
    let currentIndex = this.state.files.indexOf(currentImage) || 0;
    this.setState({currentImage, currentIndex});
  }

  getCurrentFilepath = () => {
    if (this.state.dataset.sourceFolder === '' || this.state.currentImage === '') {
      return '';
    }

    return Path.join(this.state.dataset.sourceFolder, this.state.currentImage);
  }

  getFileBrowserAndCropper = () => {
    let lenses = this.props.lenses;
    let lensName = this.state.dataset.lensName;
    let lens = lenses[lensName];

    let {imagesToDo, imagesCompleted, imagesSkipped} = this.state;

    return <div className={styles.mainContent}>
      <span>{imagesCompleted} completed, {imagesSkipped} skipped. {imagesToDo} to go.</span>
      <ul className={styles.browser} tabIndex="0">
        {this.state.files.map(filename => <li
          key={filename}
          className={ filename === this.state.currentImage ? styles.active : {}}
          onClick={this.imageClicked}>
            {filename}
        </li>)}
      </ul>
      <div className={styles.cropper}>

        <Cropper
          width={500} height={500}
          src={this.getCurrentFilepath()}
          lens={lens}
          save={this.saveSnapshot}
          skip={this.skipImage}
          />
      </div>
    </div>
  }

  getMainView = () => {
    if (this.state.dataset.datasetName === '') {
      return <p>Choose a datset from the drop menu.</p>
    } else {
      return this.getFileBrowserAndCropper();
    }
  }

  render() {

    const mainView = this.getMainView();

    return (<div>
      <h1>Dataset Editor</h1>
      <select value={this.state.dataset.datasetName} onChange={this.onDatasetChange}>
        <option></option>
        {
          Object.keys(this.props.datasets).map(ds => {
            return <option key={ds} value={ds}>{ds}</option>
          })
        }
      </select>
      <hr />
      {mainView}

    </div>
    )
  }
}

export default DatasetEditor;