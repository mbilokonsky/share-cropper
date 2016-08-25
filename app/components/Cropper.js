import React, { Component, PropTypes } from 'react';

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

      if (lens.width < 10) {
        return new Error(`${componentName} received a lens whose width is less than 10px, the minumum required.`);
      }

      if (isNaN(lens.height)) {
        return new Error(`${componentName} received a lens but its height is NaN.`);
      }

      if (lens.height < 10) {
        return new Error(`${componentName} received a lens whose width is less than 10px, the minumum required.`)
      }
    },
  };

  constructor() {
    super();
    this.state = {
      locked: false,
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotation: 0
    }
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

  keyPressHandler = (e) => {
    switch(e.which) {
      case KEYS.BACKSPACE:
        return this.props.skip();
      case KEYS.ENTER:
        return this.props.save(this.refs.canvas);
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

  render() {
    const {width, height, save, skip, src, lens} = this.props;

    let scaleRatio = width / lens.width;

    const rotationOrigin = {
      x: (scaleRatio * lens.x1),
      y: (scaleRatio * lens.y1)
    };

    /*
      translate(-centerX*(factor-1), -centerY*(factor-1))
    */

    let scaleTransform = `translate(${-rotationOrigin.x * (this.state.scale - 1)}, ${-rotationOrigin.y * (this.state.scale - 1)}) scale(${this.state.scale})`;
    let rotationTransform = `rotate(${this.state.rotation}, ${rotationOrigin.x}, ${rotationOrigin.y})`;
    let translationTransform = `translate(${this.state.translateX}, ${this.state.translateY})`;

    let transform = [scaleTransform, rotationTransform, translationTransform].join(' ');
    return (
      <svg
        width={width} height={height}
        onKeyDown={this.keyPressHandler}
        tabIndex="0"
        ref="canvas">
        <rect
          x="0" y="0"
          width={width} height={height}/>

        <image
          href={src}
          x={0} y={0}
          width={width} height={height}
          transform={transform}
          />

        <line
          x1="0" y1={lens.y1 * scaleRatio}
          x2={lens.x1 * scaleRatio} y2={lens.y1 * scaleRatio}
          stroke="red"
          strokeWidth="3" />

        <line
          x1={width} y1={lens.y2 * scaleRatio}
          x2={lens.x2 * scaleRatio} y2={lens.y2 * scaleRatio}
          stroke="red"
          strokeWidth="3" />

      </svg>
    );
  }
}

export default Cropper;