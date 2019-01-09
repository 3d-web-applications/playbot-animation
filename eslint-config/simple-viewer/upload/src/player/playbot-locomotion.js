import { registerFunction } from '../utils/main-loop';
import { PerformActions } from '../utils/main-loop-stages';

const { attributes, prototype } = pc.createScript('PlaybotLocomotion');

attributes.add('_maxForces', {
  type: 'vec3',
  title: 'Forces',
  default: [45, 15, 45],
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
  const {
    _maxForces, _rigidbody, intensityX, intensityY, intensityZ,
  } = this;
  const { x, y, z } = _maxForces;
  const { forward } = _rigidbody.entity;

  if (intensityX) {
    _rigidbody.applyTorque(0, x * intensityX * 0.2, 0);
    _rigidbody.applyForce(forward.scale(-x));
    return;
  }
  if (intensityY) {
    _rigidbody.applyForce(0, y, 0);
    return;
  }
  if (intensityZ) {
    _rigidbody.applyForce(forward.scale(-z * intensityZ));
  }
};
