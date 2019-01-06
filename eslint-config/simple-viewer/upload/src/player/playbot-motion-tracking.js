import { registerFunction } from '../utils/main-loop';
import { EvaluateChanges } from '../utils/main-loop-stages';

const { prototype } = pc.createScript('PlaybotMotionTracking');

prototype._dx = 0;
prototype._dy = 0;
prototype._dz = 0;

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

prototype._previousX = 0;
prototype._previousY = 0;
prototype._previousZ = 0;

prototype._listener = [];

prototype.setup = function (entity) {
  this._targetEntity = entity;
  const position = entity.getPosition();
  this._previousX = position.x;
  this._previousY = position.y;
  this._previousZ = position.z;
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
};

prototype.onChange = function () {
  this._listener.forEach(fn => fn());
};
