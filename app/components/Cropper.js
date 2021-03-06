import React, { Component, PropTypes } from 'react';
import {drawTransformedImage} from '../utils/CanvasUtils.js';
import canvasBuffer from 'electron-canvas-to-buffer';

const KEYS = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESCAPE: 27,
  SPACE: 32,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40
}

const initialState = {
  locked: false,
  translateX: 0,
  translateY: 0,
  scale: 1,
  rotation: 0
}

class Cropper extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    save: PropTypes.func.isRequired,
    skip: PropTypes.func.isRequired,
    lens: function(props, propName, componentName) {
      var lens = props[propName];
      if (!lens) { return new Error(`${componentName} requires a lens to be provided.`)}

      if (isNaN(lens.width)) {
        return new Error(`${componentName} received a lens but its width is NaN.`);
      }

      if (isNaN(lens.height)) {
        return new Error(`${componentName} received a lens but its height is NaN.`);
      }
    },
  };

  constructor() {
    super();
    this.state = initialState;
  }

  componentWillMount() {
    this.loadAndDrawImage(this.props.src);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.loadAndDrawImage(nextProps.src);
    }
  }

  loadAndDrawImage = (src) => {
    var img = new Image();
    let listener = (data) => {
      this.setState({loadedImage: img});
      this.setState(initialState);
      img.removeEventListener('load', listener);
    }

    img.addEventListener('load', listener);
    img.src = src;
  }

  toggleLock = () => {
    this.setState({locked: !this.state.locked})
  }

  handleLeft = ({ctrlKey, shiftKey, repeat}) => {
    let delta = -1;
    if (ctrlKey) {
      delta *= 10;
    }

    if (shiftKey) {
      delta *= 10;
    }

    if (!this.state.locked) {
      this.setState({translateX: this.state.translateX + delta})
    } else {
      delta /= 10;
      this.setState({scale: this.state.scale + delta})
    }
  }

  handleRight = ({ctrlKey, shiftKey, repeat}) => {
    let delta = 1;
    if (ctrlKey) {
      delta *= 10;
    }

    if (shiftKey) {
      delta *= 10;
    }

    if (!this.state.locked) {
      this.setState({translateX: this.state.translateX + delta})
    } else {
      delta /= 10;
      this.setState({scale: this.state.scale + delta})
    }
  }

  handleUp = ({ctrlKey, shiftKey, repeat}) => {
    let delta = -1;
    if (ctrlKey) {
      delta *= 10;
    }

    if (shiftKey) {
      delta *= 10;
    }

    if (!this.state.locked) {
      this.setState({translateY: this.state.translateY + delta})
    } else {
      this.setState({rotation: this.state.rotation + delta})
    }
  }

  handleDown = ({ctrlKey, shiftKey, repeat}) => {
    let delta = 1;
    if (ctrlKey) {
      delta *= 10;
    }

    if (shiftKey) {
      delta *= 10;
    }

    if (!this.state.locked) {
      this.setState({translateY: this.state.translateY + delta})
    } else {
      this.setState({rotation: this.state.rotation + delta})
    }

  }

  saveImage = () => {
    let context = this.refs.canvas.getContext('2d');
    drawTransformedImage(context, this.props.lens, this.state.loadedImage, this.getTransform());
    var buffer = canvasBuffer(this.refs.canvas, 'image/png');
    this.props.save(buffer);
  }

  keyPressHandler = (e) => {
    switch(e.which) {
      case KEYS.BACKSPACE:
        return this.props.skip();
      case KEYS.ENTER:
        return this.saveImage();
      case KEYS.SPACE:
        return this.toggleLock();
      case KEYS.LEFT:
        return this.handleLeft(e);
      case KEYS.RIGHT:
        return this.handleRight(e);
      case KEYS.UP:
        return this.handleUp(e);
      case KEYS.DOWN:
        return this.handleDown(e);
    }
  }

  getCanvasStyle = () => {
    const {width, height, lens} = this.props;
    let canvasStyle = {
      backgroundColor: "#eef",
      position: 'absolute'
    };

    let widthScale = lens.width / width;
    let heightScale = lens.height / height;
    let scaleToUse = Math.max(widthScale, heightScale);

    let scaledHeight = lens.height / scaleToUse;
    let scaledWidth = lens.width / scaleToUse;

    canvasStyle.width = scaledWidth;
    canvasStyle.height = scaledHeight;
    canvasStyle.top = (height - scaledHeight) / 2;
    canvasStyle.left = (width - scaledWidth) / 2;
    return canvasStyle;
  }

  getTransform = () => {
    return {
      rotation: this.state.rotation,
      translation: {
        x: this.state.translateX,
        y: this.state.translateY
      },
      scale: this.state.scale
    };
  }

  render() {
    const {width, height, save, skip, src, lens} = this.props;

    if (this.refs.canvas && this.state.loadedImage) {
      let context = this.refs.canvas.getContext('2d');
      let transform = this.getTransform();

      drawTransformedImage(context, lens, this.state.loadedImage, transform, true);
    }

    let canvasStyle = this.getCanvasStyle();

    return (<div style={{width: width, height: height, backgroundColor: "#330000", position: "relative"}}>
      <canvas
        width={lens.width} height={lens.height}
        style={canvasStyle}
        tabIndex="0"
        onKeyDown={this.keyPressHandler}
        ref="canvas" />
      </div>
    );
  }
}

export default Cropper;