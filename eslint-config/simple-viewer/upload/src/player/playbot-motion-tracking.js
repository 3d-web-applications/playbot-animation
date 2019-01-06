import { registerFunction } from '../utils/main-loop';
import { EvaluateChanges } from '../utils/main-loop-stages';

const { prototype } = pc.createScript('PlaybotMotionTracking');

prototype._dx = 0;
prototype._dy = 0;
prototype._dz = 0;
prototype._flightHeight = 0;

Object.defineProperty(prototype, 'dx', {
  get() {
    return this._dx;
  },
});

Object.defineProperty(prototype, 'dy', {
  get() {
    return this._dy;
  },
});

Object.defineProperty(prototype, 'dz', {
  get() {
    return this._dz;
  },
});

Object.defineProperty(prototype, 'flightHeight', {
  get() {
    return this._flightHeight;
  },

  set(value) {
    if (value === this._flightHeight) {
      return;
    }
    this._flightHeight = value;
  },
});

prototype._previousX = 0;
prototype._previousY = 0;
prototype._previousZ = 0;
prototype._pivotEntity = null;
prototype._raycastDirection = null;
prototype._raycastEnd = new pc.Vec3();

prototype._listener = [];

prototype.setup = function (entity, pivot, maxJumpHeight) {
  this._targetEntity = entity;
  const position = entity.getPosition();
  this._previousX = position.x;
  this._previousY = position.y;
  this._previousZ = position.z;

  this._pivotEntity = pivot;
  this._raycastDirection = new pc.Vec3(0, -maxJumpHeight, 0);
};

prototype.postInitialize = function () {
  registerFunction(this.processMovementDirection.bind(this), EvaluateChanges);
};

prototype.processMovementDirection = function () {
  this._position = this._targetEntity.getPosition();

  this._dx = this._position.x - this._previousX;
  this._dy = this._position.y - this._previousY;
  this._dz = this._position.z - this._previousZ;
  this.onChange();
  // console.log(this.dx, this.dy, this.dz);
  this._previousX = this._position.x;
  this._previousY = this._position.y;
  this._previousZ = this._position.z;

  /** Important note: if shooting a raycast inside colliders, they won't be detected. */
  const {
    app, _pivotEntity, _raycastDirection, _raycastEnd,
  } = this;
  const { rigidbody } = app.systems;
  const raycastStart = _pivotEntity.getPosition();
  _raycastEnd.add2(raycastStart, _raycastDirection);
  const raycastResult = rigidbody.raycastFirst(raycastStart, _raycastEnd);
  if (raycastResult
    && raycastResult.entity.rigidbody
    && raycastResult.entity.rigidbody.group === 1024) {
    this.flightHeight = raycastStart.y - raycastResult.point.y;
  }
};

prototype.onChange = function () {
  this._listener.forEach(fn => fn());
};
