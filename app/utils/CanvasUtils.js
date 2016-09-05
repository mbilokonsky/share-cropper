function getImagePosition(width, height, widthScale, heightScale) {
  return (widthScale > heightScale) ? {
    x: width * .5 * heightScale,
    y: 0
  } : {
    x: 0,
    y: height * .5 * widthScale
  }
}

export function drawTransformedImage(context, lens, imageData, transform, componentDetails, includeLensPoints) {
  context.resetTransform();
  context.clearRect(0, 0, lens.width, lens.height);

  setRotation(context, transform.rotation, {x: lens.x1, y: lens.y1});
  setScale(context, transform.scale, {x: lens.x1, y: lens.y1});
  setTranslation(context, transform.translation);

  // 4: apply final scaling
  let {width, height} = imageData;
  let widthScale = componentDetails.width / width;
  let heightScale = componentDetails.height / height;
  let cropperToLensScale = componentDetails.width / lens.width;
  let cropperToImageScale = Math.min(widthScale, heightScale);
  let finalScale = cropperToLensScale * cropperToImageScale;
  setScale(context, finalScale, {x: 0, y: 0});

  const position = getImagePosition(componentDetails.width, componentDetails.height, widthScale, heightScale);
  drawImage(context, imageData, position);

  if (includeLensPoints) {
    drawLensPoints(context, lens, cropperToLensScale)
  }
}

function setScale(context, scale, point) {
  context.translate(-point.x * (scale - 1), -point.y * (scale - 1));
  context.scale(scale, scale);
}

function setRotation(context, rotation, point) {
  context.translate(point.x, point.y);
  context.rotate(rotation * Math.PI / 180);
  context.translate(-point.x, -point.y);
}

function setTranslation(context, {x, y}) {
  context.translate(x, y);
}

function drawImage(context, imageData, position) {
  context.drawImage(imageData, position.x, position.y);
  context.resetTransform();
}

function drawLensPoints(context, lens, cropperToLensScale) {
  context.resetTransform();

  let left = {
    x: lens.x1 * cropperToLensScale,
    y: lens.y1 * cropperToLensScale
  };

  let right = {
    x: lens.x2 * cropperToLensScale,
    y: lens.y2 * cropperToLensScale
  };

  context.strokeStyle = "red";
  context.beginPath();
  context.ellipse(left.x, left.y, 5, 5, 0, 0, 2 * Math.PI);
  context.ellipse(right.x, right.y, 5, 5, 0, 0, 2 * Math.PI);
  context.stroke();
}