import { registerFunction } from '../utils/main-loop';
import { InterpretState } from '../utils/main-loop-stages';

const MovementDirection = pc.createScript('MovementDirection');


MovementDirection.attributes.add('_physicalEntity', {
  type: 'entity',
  title: 'Character Root Entity',
  description: 'Character entity with a rigidbody component',
});

MovementDirection.prototype._dx = 0;
MovementDirection.prototype._dy = 0;
MovementDirection.prototype._dz = 0;

Object.defineProperty(MovementDirection.prototype, 'dx', {
  get() {
    return this._dx;
  },
});

Object.defineProperty(MovementDirection.prototype, 'dy', {
  get() {
    return this._dy;
  },
});

Object.defineProperty(MovementDirection.prototype, 'dz', {
  get() {
    return this._dz;
  },
});

MovementDirection.prototype._previousX = 0;
MovementDirection.prototype._previousY = 0;
MovementDirection.prototype._previousZ = 0;

MovementDirection.prototype.initialize = function () {
  const position = this._physicalEntity.getPosition();
  this._previousX = position.x;
  this._previousY = position.y;
  this._previousZ = position.z;
};

MovementDirection.prototype.postInitialize = function () {
  // addStateMemory(this.saveTranslation.bind(this));
  registerFunction(this.processMovementDirection.bind(this), InterpretState);
};

/* MovementDirection.prototype.saveTranslation = function () {
  this._previousX = this._position.x;
  this._previousY = this._position.y;
  this._previousZ = this._position.z;
}; */

MovementDirection.prototype.processMovementDirection = function () {
  this._position = this._physicalEntity.getPosition();
  this._dx = this._position.x - this._previousX;
  this._dy = this._position.y - this._previousY;
  this._dz = this._position.z - this._previousZ;
  console.log(this.dx, this.dy, this.dz);
  this._previousX = this._position.x;
  this._previousY = this._position.y;
  this._previousZ = this._position.z;
};
