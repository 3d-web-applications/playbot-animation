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

  /* Important note: Damping from Rigidbody is used to prevent adding up forces over multiple frames.
  But when linear damping = 1, even the gravity is highly affected. Objects will fall at the beginning
  and will hover in the air until a new force was applied for a short amount of time. Only after this force was
  canceled, the gravity will be applied to the object again. This must be repeated until the object reaches the
  ground. One can set the linear damping to 0.999. Then the object will fall continously until it reaches
  the ground. But allowing PlayCanvas to handle the gravity still might be a bad idea. Applying a constant force
  at a specific moment in the current main loop frame to simulate the gravity could be a wise decision.
  */
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
