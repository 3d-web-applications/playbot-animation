import { registerFunction } from '../utils/main-loop';
import { EvaluateChanges } from '../utils/main-loop-stages';

const PlaybotMotionTracking = pc.createScript('PlaybotMotionTracking');

PlaybotMotionTracking.prototype._dx = 0;
PlaybotMotionTracking.prototype._dy = 0;
PlaybotMotionTracking.prototype._dz = 0;

Object.defineProperty(PlaybotMotionTracking.prototype, 'dx', {
  get() {
    return this._dx;
  },
});

Object.defineProperty(PlaybotMotionTracking.prototype, 'dy', {
  get() {
    return this._dy;
  },
});

Object.defineProperty(PlaybotMotionTracking.prototype, 'dz', {
  get() {
    return this._dz;
  },
});

PlaybotMotionTracking.prototype._previousX = 0;
PlaybotMotionTracking.prototype._previousY = 0;
PlaybotMotionTracking.prototype._previousZ = 0;

PlaybotMotionTracking.prototype._listener = [];

PlaybotMotionTracking.prototype.setup = function (entity) {
  this._targetEntity = entity;
  const position = entity.getPosition();
  this._previousX = position.x;
  this._previousY = position.y;
  this._previousZ = position.z;
};

PlaybotMotionTracking.prototype.postInitialize = function () {
  registerFunction(this.processMovementDirection.bind(this), EvaluateChanges);
};

PlaybotMotionTracking.prototype.processMovementDirection = function () {
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

PlaybotMotionTracking.prototype.onChange = function () {
  this._listener.forEach(fn => fn());
};
