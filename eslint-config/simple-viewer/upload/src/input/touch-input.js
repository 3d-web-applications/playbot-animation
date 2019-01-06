const { attributes, prototype } = pc.createScript('touchInput');

attributes.add('orbitSensitivity', {
  type: 'number',
  default: 0.4,
  title: 'Orbit Sensitivity',
  description: 'How fast the camera moves around the orbit. Higher is faster',
});

attributes.add('distanceSensitivity', {
  type: 'number',
  default: 0.2,
  title: 'Distance Sensitivity',
  description: 'How fast the camera moves in and out. Higher is faster',
});

prototype.initialize = function () {
  this.orbitCamera = this.entity.script.orbitCamera;

  // Store the position of the touch so we can calculate the distance moved
  this.lastTouchPoint = new pc.Vec2();
  this.lastPinchMidPoint = new pc.Vec2();
  this.lastPinchDistance = 0;

  if (this.orbitCamera && this.app.touch) {
    // Use the same callback for the touchStart, touchEnd and touchCancel events as they
    // all do the same thing which is to deal the possible multiple touches to the screen
    this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this);
    this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this);
    this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this);

    this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);

    this.on('destroy', function () {
      this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this);
      this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this);
      this.app.touch.off(pc.EVENT_TOUCHCANCEL,
        this.onTouchStartEndCancel, this);

      this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
    });
  }
};

prototype.getPinchDistance = function (pointA, pointB) {
  // Return the distance between the two points
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;

  return Math.sqrt((dx * dx) + (dy * dy));
};

prototype.calcMidPoint = function (pointA, pointB, result) {
  const newResult = result;
  result.set(pointB.x - pointA.x, pointB.y - pointA.y);
  result.scale(0.5);
  newResult.x += pointA.x;
  newResult.y += pointA.y;
  return newResult;
};

prototype.onTouchStartEndCancel = function (event) {
  // We only care about the first touch for camera rotation. As the user touches the screen,
  // we stored the current touch position
  const { touches } = event;
  if (touches.length === 1) {
    this.lastTouchPoint.set(touches[0].x, touches[0].y);
  } else if (touches.length === 2) {
    // If there are 2 touches on the screen, then set the pinch distance
    this.lastPinchDistance = this.getPinchDistance(touches[0], touches[1]);
    this.lastPinchMidPoint = this.calcMidPoint(
      touches[0], touches[1], this.lastPinchMidPoint,
    );
  }
};

const fromWorldPoint = new pc.Vec3();
const toWorldPoint = new pc.Vec3();
const worldDiff = new pc.Vec3();

prototype.pan = function (midPoint) {
  // For panning to work at any zoom level, we use screen point to world projection
  // to work out how far we need to pan the pivotEntity in world space
  const { camera } = this.entity;
  const { distance } = this.orbitCamera;

  camera.screenToWorld(midPoint.x, midPoint.y, distance, fromWorldPoint);
  camera.screenToWorld(
    this.lastPinchMidPoint.x, this.lastPinchMidPoint.y, distance, toWorldPoint,
  );

  worldDiff.sub2(toWorldPoint, fromWorldPoint);

  this.orbitCamera.pivotPoint.add(worldDiff);
};

let pinchMidPoint = new pc.Vec2();

prototype.onTouchMove = function (event) {
  // We only care about the first touch for camera rotation. Work out the difference moved since the last event
  // and use that to update the camera target position
  const { touches } = event;
  if (touches.length === 1) {
    const touch = touches[0];

    this.orbitCamera.pitch
      -= (touch.y - this.lastTouchPoint.y) * this.orbitSensitivity;
    this.orbitCamera.yaw
      -= (touch.x - this.lastTouchPoint.x) * this.orbitSensitivity;

    this.lastTouchPoint.set(touch.x, touch.y);
  } else if (touches.length === 2) {
    // Calculate the difference in pinch distance since the last event
    const currentPinchDistance = this.getPinchDistance(touches[0], touches[1]);
    const diffInPinchDistance = currentPinchDistance - this.lastPinchDistance;
    this.lastPinchDistance = currentPinchDistance;

    this.orbitCamera.distance
      -= (diffInPinchDistance * this.distanceSensitivity * 0.1)
      * (this.orbitCamera.distance * 0.1);

    // Calculate pan difference
    pinchMidPoint = this.calcMidPoint(touches[0], touches[1], pinchMidPoint);
    this.pan(pinchMidPoint);
    this.lastPinchMidPoint.copy(pinchMidPoint);
  }
};
