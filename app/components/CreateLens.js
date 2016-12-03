import React, { Component, PropTypes } from 'react';
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
      p1: {
        x: 114,
        y: 138,
        target: 'left eye'
      },
      p2: {
        x: 186,
        y: 138,
        target: 'right eye'
      },
      bgImage: "",
    }
  }

  setLensName = (e) => {
    let v = e.target.value;
    this.setState({lensName: v});
  }

  setWidth = (e) => {
    let v = parseInt(e.target.value);
    if(isNaN(v)) {
      v = 0;
    }

    this.setState({width: v});
  }

  setHeight = (e) => {
    let v = parseInt(e.target.value);
    if(isNaN(v)) {
      v = 0;
    }

    this.setState({height: v});
  }

  updateP1 = (e) => {
    let x = parseInt(this.refs.p1x.value);
    if (isNaN(x)) {
      x = 0;
    }

    let y = parseInt(this.refs.p1y.value);
    if (isNaN(y)) {
      y = 0;
    }

    let target = this.refs.p1t.value;

    this.setState({p1: {x, y, target}});
  }

  updateP2 = (e) => {
    let x = parseInt(this.refs.p2x.value);
    if (isNaN(x)) {
      x = 0;
    }

    let y = parseInt(this.refs.p2y.value);
    if (isNaN(y)) {
      y = 0;
    }

    let target = this.refs.p2t.value;

    this.setState({p2: {x, y, target}});
  }

  saveLens = () => {
    this.props.saveLens(this.state);
  }

  setBG = (filenames) => {
    this.setState({bgImage: filenames[0]});
  }

  loadBackgroundImage = () => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{
        name: 'Images',
        extensions: ['jpg', 'png', 'gif']
      }]
    }, this.setBG);
  }

  render() {
    const { lensName, width, height, bgImage, p1, p2 } = this.state;

    var rectWidth = 300;
    var rectRatio = rectWidth / width;
    var rectHeight = height * rectRatio;

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
        Target Name:
        <input type="text"
        value={p1.target}
        onChange={this.updateP1}
        ref="p1t" />
      </label>
      <label>
        X:
        <input type="number"
        min="0" max={width}
        value={p1.x}
        onChange={this.updateP1}
        ref='p1x'/>
      </label>

      <label>
        Y:
        <input type="number"
        min="0" max={height}
        value={p1.y}
        onChange={this.updateP1}
        ref='p1y'/>
      </label>
      <br />

      <h3>Second Point</h3>
      <label>
        Target Name:
        <input type="text"
        value={p2.target}
        onChange={this.updateP2}
        ref="p2t" />
      </label>
      <label>
        X:
        <input type="number"
        min="0" max={width}
        value={p2.x}
        onChange={this.updateP2}
        ref='p2x'/>
      </label>

      <label>
        Y:
        <input type="number"
        min="0" max={height}
        value={p2.y}
        onChange={this.updateP2}
        ref='p2y'/>
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
