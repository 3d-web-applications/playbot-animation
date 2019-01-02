import { registerFunction } from '../utils/main-loop';
import { PerformActions } from '../utils/main-loop-stages';

const PlayerPropulsion = pc.createScript('PlayerPropulsion');

PlayerPropulsion.attributes.add('_physicalEntity', {
  type: 'entity',
  title: 'Character Root Entity',
  description: 'Character entity with a rigidbody component',
});

PlayerPropulsion.attributes.add('_maxForces', {
  type: 'vec3',
  title: 'Forces',
  default: [15, 15, 15],
  description: 'Forces in x/y/z',
});

PlayerPropulsion.prototype._rigidbody = null;
PlayerPropulsion.prototype.intensityX = 0;
PlayerPropulsion.prototype.intensityY = 0;
PlayerPropulsion.prototype.intensityZ = 0;

PlayerPropulsion.prototype.initialize = function () {
  this._rigidbody = this._physicalEntity.rigidbody;
};

PlayerPropulsion.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), PerformActions);
};

PlayerPropulsion.prototype.syncedUpdate = function () {
  const { x, y, z } = this._maxForces;
  this._rigidbody.applyForce(
    x * this.intensityX,
    y * this.intensityY,
    z * this.intensityZ,
  );
};
