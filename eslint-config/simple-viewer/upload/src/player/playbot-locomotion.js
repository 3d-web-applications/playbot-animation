import { registerFunction } from '../utils/main-loop';
import { PerformActions } from '../utils/main-loop-stages';

const PlaybotLocomotion = pc.createScript('PlaybotLocomotion');

PlaybotLocomotion.attributes.add('_physicalEntity', {
  type: 'entity',
  title: 'Character Root Entity',
  description: 'Character entity with a rigidbody component',
});

PlaybotLocomotion.attributes.add('_maxForces', {
  type: 'vec3',
  title: 'Forces',
  default: [15, 15, 15],
  description: 'Forces in x/y/z',
});

PlaybotLocomotion.prototype._rigidbody = null;
PlaybotLocomotion.prototype.intensityX = 0;
PlaybotLocomotion.prototype.intensityY = 0;
PlaybotLocomotion.prototype.intensityZ = 0;

PlaybotLocomotion.prototype.initialize = function () {
  this._rigidbody = this._physicalEntity.rigidbody;
};

PlaybotLocomotion.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), PerformActions);
};

PlaybotLocomotion.prototype.syncedUpdate = function () {
  const { x, y, z } = this._maxForces;
  this._rigidbody.applyForce(
    x * this.intensityX,
    y * this.intensityY,
    z * this.intensityZ,
  );
};
