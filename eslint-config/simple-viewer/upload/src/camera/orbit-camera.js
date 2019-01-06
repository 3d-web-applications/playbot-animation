const { attributes, prototype } = pc.createScript('orbitCamera');

attributes.add('distanceMax', {
  type: 'number',
  default: 0,
  title: 'Distance Max',
  description: 'Setting this at 0 will give an infinite'
    + 'distance limit',
});

attributes.add('distanceMin', {
  type: 'number',
  default: 0,
  title: 'Distance Min',
});

attributes.add('pitchAngleMax', {
  type: 'number',
  default: 90,
  title: 'Pitch Angle Max (degrees)',
});

attributes.add('pitchAngleMin', {
  type: 'number',
  default: -90,
  title: 'Pitch Angle Min (degrees)',
});

attributes.add('inertiaFactor', {
  type: 'number',
  default: 0,
  title: 'Inertia Factor',
  description: 'Higher value means that the camera will'
    + 'continue moving after the user has stopped dragging.'
    + '0 is fully responsive.',
});

attributes.add('focusEntity', {
  type: 'entity',
  title: 'Focus Entity',
  description: 'Entity for the camera to focus on. If blank,'
    + 'then the camera will use the whole scene',
});

attributes.add('frameOnStart', {
  type: 'boolean',
  default: true,
  title: 'Frame on Start',
  description: 'Frames the entity or scene at the start of'
    + 'the application.',
});

// Property to get and set the distance between the pivot point and camera
// Clamped between this.distanceMin and this.distanceMax
Object.defineProperty(prototype, 'distance', {
  get() {
    return this._targetDistance;
  },

  set(value) {
    this._targetDistance = this._clampDistance(value);
  },
});

// Property to get and set the pitch of the camera around the pivot point (degrees)
// Clamped between this.pitchAngleMin and this.pitchAngleMax
// When set at 0, the camera angle is flat, looking along the horizon
Object.defineProperty(prototype, 'pitch', {
  get() {
    return this._targetPitch;
  },

  set(value) {
    this._targetPitch = this._clampPitchAngle(value);
  },
});

// Property to get and set the yaw of the camera around the pivot point (degrees)
Object.defineProperty(prototype, 'yaw', {
  get() {
    return this._targetYaw;
  },

  set(value) {
    this._targetYaw = value;

    // Ensure that the yaw takes the shortest route by making sure that
    // the difference between the targetYaw and the actual is 180 degrees
    // in either direction
    const diff = this._targetYaw - this._yaw;
    const reminder = diff % 360;
    if (reminder > 180) {
      this._targetYaw = this._yaw - (360 - reminder);
    } else if (reminder < -180) {
      this._targetYaw = this._yaw + (360 + reminder);
    } else {
      this._targetYaw = this._yaw + reminder;
    }
  },
});

// Property to get and set the world position of the pivot point that the camera orbits around
Object.defineProperty(prototype, 'pivotPoint', {
  get() {
    return this._pivotPoint;
  },

  set(value) {
    this._pivotPoint.copy(value);
  },
});

// Moves the camera to look at an entity and all its children so they are all in the view
prototype.focus = function (focusEntity) {
// Calculate an bounding box that encompasses all the models to frame in the camera view
  this._buildAabb(focusEntity, 0);

  const { halfExtents } = this._modelsAabb;

  let distance = Math.max(
    halfExtents.x, Math.max(halfExtents.y, halfExtents.z),
  );
  distance /= Math.tan(0.5 * this.entity.camera.fov * pc.math.DEG_TO_RAD);
  distance *= 2;

  this.distance = distance;

  this._removeInertia();

  this._pivotPoint.copy(this._modelsAabb.center);
};

const distanceBetween = new pc.Vec3();

// Set the camera position to a world position and look at a world position
// Useful if you have multiple viewing angles to swap between in a scene
prototype.resetAndLookAtPoint = function (resetPoint, lookAtPoint) {
  this.pivotPoint.copy(lookAtPoint);
  this.entity.setPosition(resetPoint);

  this.entity.lookAt(lookAtPoint);

  const distance = distanceBetween;
  distance.sub2(lookAtPoint, resetPoint);
  this.distance = distance.length();

  this.pivotPoint.copy(lookAtPoint);

  const cameraQuat = this.entity.getRotation();
  this.yaw = this._calcYaw(cameraQuat);
  this.pitch = this._calcPitch(cameraQuat, this.yaw);

  this._removeInertia();
  this._updatePosition();
};

// Set camera position to a world position and look at an entity in the scene
// Useful if you have multiple models to swap between in a scene
prototype.resetAndLookAtEntity = function (resetPoint, entity) {
  this._buildAabb(entity, 0);
  this.resetAndLookAtPoint(resetPoint, this._modelsAabb.center);
};

// Set the camera at a specific, yaw, pitch and distance without inertia (instant cut)
prototype.reset = function (yaw, pitch, distance) {
  this.pitch = pitch;
  this.yaw = yaw;
  this.distance = distance;

  this._removeInertia();
};

prototype.initialize = function () {
  const self = this;

  const onWindowResize = function () {
    self._checkAspectRatio();
  };

  window.addEventListener('resize', onWindowResize, false);

  this._checkAspectRatio();

  // Find all the models in the scene that are under the focused entity
  this._modelsAabb = new pc.BoundingBox();
  this._buildAabb(this.focusEntity || this.app.root, 0);

  this.entity.lookAt(this._modelsAabb.center);

  this._pivotPoint = new pc.Vec3();
  this._pivotPoint.copy(this._modelsAabb.center);

  // Calculate the camera euler angle rotation around x and y axes
  // This allows us to place the camera at a particular rotation to begin with in the scene
  const cameraQuat = this.entity.getRotation();

  // Preset the camera
  this._yaw = this._calcYaw(cameraQuat);
  this._pitch = this._clampPitchAngle(this._calcPitch(cameraQuat, this._yaw));
  this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

  this._distance = 0;

  this._targetYaw = this._yaw;
  this._targetPitch = this._pitch;

  // If we have ticked focus on start, then attempt to position the camera where it frames
  // the focused entity and move the pivot point to entity's position otherwise, set the distance
  // to be between the camera position in the scene and the pivot point
  if (this.frameOnStart) {
    this.focus(this.focusEntity || this.app.root);
  } else {
    const distanceInBetween = new pc.Vec3();
    distanceInBetween.sub2(this.entity.getPosition(), this._pivotPoint);
    this._distance = this._clampDistance(distanceInBetween.length());
  }

  this._targetDistance = this._distance;

  // Reapply the clamps if they are changed in the editor
  this.on('attr:distanceMin', function (/* value, prev */) {
    this._targetDistance = this._clampDistance(this._distance);
  });

  this.on('attr:distanceMax', function (/* value, prev */) {
    this._targetDistance = this._clampDistance(this._distance);
  });

  this.on('attr:pitchAngleMin', function (/* value, prev */) {
    this._targetPitch = this._clampPitchAngle(this._pitch);
  });

  this.on('attr:pitchAngleMax', function (/* value, prev */) {
    this._targetPitch = this._clampPitchAngle(this._pitch);
  });

  // Focus on the entity if we change the focus entity
  this.on('attr:focusEntity', function (value/* , prev */) {
    if (this.frameOnStart) {
      this.focus(value || this.app.root);
    } else {
      this.resetAndLookAtEntity(this.entity.getPosition(), value
        || this.app.root);
    }
  });

  this.on('attr:frameOnStart', function (value/* , prev */) {
    if (value) {
      this.focus(this.focusEntity || this.app.root);
    }
  });

  this.on('destroy', () => {
    window.removeEventListener('resize', onWindowResize, false);
  });
};

prototype.update = function (dt) {
  // Add inertia, if any
  const t = this.inertiaFactor === 0 ? 1 : Math.min(dt / this.inertiaFactor, 1);
  this._distance = pc.math.lerp(this._distance, this._targetDistance, t);
  this._yaw = pc.math.lerp(this._yaw, this._targetYaw, t);
  this._pitch = pc.math.lerp(this._pitch, this._targetPitch, t);

  this._updatePosition();
};

prototype._updatePosition = function () {
  // Work out the camera position based on the pivot point, pitch, yaw and distance
  this.entity.setLocalPosition(0, 0, 0);
  this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

  const position = this.entity.getPosition();
  position.copy(this.entity.forward);
  position.scale(-this._distance);
  position.add(this.pivotPoint);
  this.entity.setPosition(position);
};

prototype._removeInertia = function () {
  this._yaw = this._targetYaw;
  this._pitch = this._targetPitch;
  this._distance = this._targetDistance;
};

prototype._checkAspectRatio = function () {
  const { height, width } = this.app.graphicsDevice;

  // Match the axis of FOV to match the aspect ratio of the canvas so
  // the focused entities is always in frame
  this.entity.camera.horizontalFov = height > width;
};

prototype._buildAabb = function (entity, modelsAdded) {
  let i = 0;
  let count = modelsAdded;

  if (entity.model) {
    const mi = entity.model.meshInstances;
    for (i = 0; i < mi.length; i += 1) {
      if (modelsAdded === 0) {
        this._modelsAabb.copy(mi[i].aabb);
      } else {
        this._modelsAabb.add(mi[i].aabb);
      }

      count += 1;
    }
  }

  for (i = 0; i < entity.children.length; i += 1) {
    count += this._buildAabb(entity.children[i], modelsAdded);
  }

  return count;
};

prototype._calcYaw = function (quat) {
  const transformedForward = new pc.Vec3();
  quat.transformVector(pc.Vec3.FORWARD, transformedForward);

  return Math.atan2(-transformedForward.x, -transformedForward.z)
    * pc.math.RAD_TO_DEG;
};

prototype._clampDistance = function (distance) {
  if (this.distanceMax > 0) {
    return pc.math.clamp(distance, this.distanceMin, this.distanceMax);
  }

  return Math.max(distance, this.distanceMin);
};

prototype._clampPitchAngle = function (pitch) {
  // Negative due as the pitch is inversed since the camera is orbiting the entity
  return pc.math.clamp(pitch, -this.pitchAngleMax, -this.pitchAngleMin);
};

const quatWithoutYaw = new pc.Quat();
const yawOffset = new pc.Quat();

prototype._calcPitch = function (quat, yaw) {
  yawOffset.setFromEulerAngles(0, -yaw, 0);
  quatWithoutYaw.mul2(yawOffset, quat);

  const transformedForward = new pc.Vec3();

  quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);

  return Math.atan2(transformedForward.y, -transformedForward.z)
    * pc.math.RAD_TO_DEG;
};
