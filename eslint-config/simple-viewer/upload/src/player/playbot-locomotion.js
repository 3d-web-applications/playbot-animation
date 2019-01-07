import { registerFunction } from '../utils/main-loop';
import { PerformActions } from '../utils/main-loop-stages';

const { attributes, prototype } = pc.createScript('PlaybotLocomotion');

attributes.add('_maxForces', {
  type: 'vec3',
  title: 'Forces',
  default: [15, 15, 15],
  description: 'Forces in x/y/z',
});

prototype._rigidbody = null;
prototype.intensityX = 0;
prototype.intensityY = 0;
prototype.intensityZ = 0;

prototype.setup = function (rigidbody) {
  this._rigidbody = rigidbody;
};

prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), PerformActions);
};

prototype.syncedUpdate = function () {
  const { x, y, z } = this._maxForces;
  /* this._rigidbody.applyForce(
    0, // x * this.intensityX,
    y * this.intensityY,
    z * this.intensityZ + x * this.intensityX,
  ); */
  if (x) {
    this._rigidbody.applyTorque(0, x * this.intensityX * 0.2, 0);
  }
  if (y) {
    this._rigidbody.applyForce(0, y * this.intensityY, 0);
  }
  if (z) {
    this._rigidbody.applyForce(this._rigidbody.entity.forward.clone().scale(-z * this.intensityZ));
  }
};
