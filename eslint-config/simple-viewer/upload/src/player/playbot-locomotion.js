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
  this._rigidbody.applyForce(
    x * this.intensityX,
    y * this.intensityY,
    z * this.intensityZ,
  );
};
