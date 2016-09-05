import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './CreateLens.css';
import Cropper from './Cropper.js';
import fs from 'fs';

import electron from 'electron'
const dialog = electron.remote.dialog;

class CreateLens extends Component {
  static propTypes = {
    saveLens: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      lensName: "New Lens",
      width: 300,
      height: 300,
      bgImage: "",
      x1: 114,
      y1: 138,
      x2: 186,
      y2: 138
    }
  }

  setLensName = (e) => {
    let v = e.target.value;
    this.setState({lensName: v});
  }

  setWidth = (e) => {
    let v = parseInt(e.target.value || 0);
    this.setState({
      width: v,
      x1: parseInt(v * (this.state.x1 / this.state.width)),
      x2: parseInt(v * (this.state.x2 / this.state.width))
    });
  }

  setHeight = (e) => {
    let v = parseInt(e.target.value || 0);
    this.setState({
      height: v,
      y1: parseInt(v * (this.state.y1 / this.state.height)),
      y2: parseInt(v * (this.state.y2 / this.state.height))
    });
  }

  setX1 = (e) => {
    let v = parseInt(e.target.value || 0);
    this.setState({x1: v});
  }

  setY1 = (e) => {
    let v = parseInt(e.target.value || 0);
    this.setState({y1: v});
  }

  setX2 = (e) => {
    let v = parseInt(e.target.value || 0);
    this.setState({x2: v});
  }

  setY2 = (e) => {
    let v = parseInt(e.target.value || 0);
    this.setState({y2: v});
  }

  saveLens = () => {
    console.log("Now creating a lens out of the following", this.state);
    this.props.saveLens(this.state);
  }

  setBG = (filenames) => {
    console.log("BACKGROUND IMAGE OPENED!");
    this.setState({bgImage: filenames[0]});
  }

  loadBackgroundImage = () => {
    console.log("OPENING BACKGROUND IMAGE!!!");

    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{
        name: 'Images',
        extensions: ['jpg', 'png', 'gif']
      }]
    }, this.setBG);
  }

  render() {
    const { lensName, width, height, bgImage, x1, x2, y1, y2 } = this.state;

    var rectWidth = 300;
    var rectRatio = rectWidth / width;
    var rectHeight = height * rectRatio;
    console.log("bgImage:", bgImage);
    return (<div>
      <h1>Create a Lens</h1>
      <label>
        <span>Name:</span>
        <input type="text"
          value={lensName}
          onChange={this.setLensName} />
      </label>
      <br />
      <label>
        <span>Width:</span>
        <input type="number"
          min="10" max="640"
          value={width}
          onChange={this.setWidth}/>
      </label>
      <br />
      <label>
        <span>Height:</span>
        <input type="number"
        min="10" max="640"
        value={height}
        onChange={this.setHeight}/>
      </label>
      <br />
      <h3>First Point</h3>
      <label>
        X:
        <input type="number"
        min="0" max={width}
        value={x1}
        onChange={this.setX1}/>
      </label>

      <label>
        Y:
        <input type="number"
        min="0" max={height}
        value={y1}
        onChange={this.setY1}/>
      </label>
      <br />

      <h3>Second Point</h3>
      <label>
        X:
        <input type="number"
        min="0" max={width}
        value={x2}
        onChange={this.setX2}/>
      </label>

      <label>
        Y:
        <input type="number"
        min="0" max={height}
        value={y2}
        onChange={this.setY2}/>
      </label>
      <br />
      <h3>Example</h3>
      <button onClick={this.loadBackgroundImage}>Load Sample Image</button>
      <br />
      <Cropper
        width={300} height={300}
        src={bgImage}
        save={(buffer) => {
          fs.writeFileSync('/Users/mykola/Desktop/test.png', buffer);
        }}
        skip={() => {}}
        lens={this.state}
      ></Cropper>

      <br />

      <button onClick={this.saveLens}>Save Lens</button>

    </div>);
  }
}

export default CreateLens;
