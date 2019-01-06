const { attributes, prototype } = pc.createScript('mouseInput');

attributes.add('orbitSensitivity', {
  type: 'number',
  default: 0.3,
  title: 'Orbit Sensitivity',
  description: 'How fast the camera moves around the orbit. Higher is faster',
});

attributes.add('distanceSensitivity', {
  type: 'number',
  default: 0.15,
  title: 'Distance Sensitivity',
  description: 'How fast the camera moves in and out. Higher is faster',
});

prototype.initialize = function () {
  this.orbitCamera = this.entity.script.orbitCamera;

  if (this.orbitCamera) {
    const self = this;

    const onMouseOut = function (e) {
      self.onMouseOut(e);
    };

    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

    // Listen to when the mouse travels out of the window
    window.addEventListener('mouseout', onMouseOut, false);

    // Remove the listeners so if this entity is destroyed
    this.on('destroy', function () {
      this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
      this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
      this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
      this.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

      window.removeEventListener('mouseout', onMouseOut, false);
    });
  }

  // Disabling the context menu stops the browser displaying a menu when
  // you right-click the page
  this.app.mouse.disableContextMenu();

  this.lookButtonDown = false;
  this.panButtonDown = false;
  this.lastPoint = new pc.Vec2();
};

const fromWorldPoint = new pc.Vec3();
const toWorldPoint = new pc.Vec3();
const worldDiff = new pc.Vec3();

prototype.pan = function (screenPoint) {
  // For panning to work at any zoom level, we use screen point to world projection
  // to work out how far we need to pan the pivotEntity in world space
  const { camera } = this.entity;
  const { distance } = this.orbitCamera;

  camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
  camera.screenToWorld(
    this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint,
  );

  worldDiff.sub2(toWorldPoint, fromWorldPoint);

  this.orbitCamera.pivotPoint.add(worldDiff);
};

prototype.onMouseDown = function (event) {
  switch (event.button) {
    case pc.MOUSEBUTTON_LEFT:
      this.lookButtonDown = true;
      break;
    case pc.MOUSEBUTTON_MIDDLE:
    case pc.MOUSEBUTTON_RIGHT:
      this.panButtonDown = true;
      break;
    default:
      break;
  }
};

prototype.onMouseUp = function (event) {
  switch (event.button) {
    case pc.MOUSEBUTTON_LEFT:
      this.lookButtonDown = false;
      break;
    case pc.MOUSEBUTTON_MIDDLE:
    case pc.MOUSEBUTTON_RIGHT:
      this.panButtonDown = false;
      break;
    default:
      break;
  }
};

prototype.onMouseMove = function (event) {
  if (this.lookButtonDown) {
    this.orbitCamera.pitch -= event.dy * this.orbitSensitivity;
    this.orbitCamera.yaw -= event.dx * this.orbitSensitivity;
  } else if (this.panButtonDown) {
    this.pan(event);
  }

  this.lastPoint.set(event.x, event.y);
};

prototype.onMouseWheel = function (event) {
  this.orbitCamera.distance -= event.wheel
    * this.distanceSensitivity * (this.orbitCamera.distance * 0.1);
  event.event.preventDefault();
};

prototype.onMouseOut = function (/* event */) {
  this.lookButtonDown = false;
  this.panButtonDown = false;
};
