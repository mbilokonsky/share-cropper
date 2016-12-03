export function drawTransformedImage(context, lens, imageData, transform, includeLensPoints) {
  context.resetTransform();
  context.clearRect(0, 0, lens.width, lens.height);

  setRotation(context, transform.rotation, {x: lens.p1.x, y: lens.p1.y});
  setScale(context, transform.scale, {x: lens.p1.x, y: lens.p1.y});
  setTranslation(context, transform.translation);

  // 4: apply final scaling
  let {width, height} = imageData;
  let widthScale = lens.width / width;
  let heightScale = lens.height / height;
  let scaleToUse = Math.min(widthScale, heightScale);

  setScale(context, scaleToUse, {x: 0, y: 0});

  let scaledWidth = width * scaleToUse;
  let scaledHeight = height * scaleToUse;

  const position = {
    x: ((lens.width - scaledWidth) / 2) / scaleToUse,
    y: ((lens.height - scaledHeight) / 2) / scaleToUse
  };

  drawImage(context, imageData, position);

  if (includeLensPoints) {
    drawLensPoints(context, lens);
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

function drawLensPoints(context, lens) {
  context.resetTransform();

  let left = lens.p1;
  let right = lens.p2;

  context.strokeStyle = "red";
  context.beginPath();
  context.ellipse(left.x, left.y, 5, 5, 0, 0, 2 * Math.PI);
  context.ellipse(right.x, right.y, 5, 5, 0, 0, 2 * Math.PI);
  context.stroke();
}