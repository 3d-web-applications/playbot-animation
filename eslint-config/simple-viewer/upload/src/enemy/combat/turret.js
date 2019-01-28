import settings from '../enemy-types/turret';
import { signedAngle } from '../../math/vec3/signed-angle';

const { attributes, prototype } = pc.createScript('Turret');

const distance = new pc.Vec3();

attributes.add('_target', {
  type: 'entity',
});

Object.defineProperty(prototype, 'target', {
  get() {
    return this._target;
  },
  set(value) {
    this._target = value;
  },
});

prototype.initialize = function () {
  // this._target = null;
  this._readyToFire = true;
  // this._reloadTime = settings.COOLDOWN_TIME;
  this._rotationSpeed = settings.ROTATION_SPEED;
};

// if not ready to fire, reload
// if no target, stop here
// if target is not in range, stop here
// if target is not in field of fire, rotate towards target
// if target is in field of fire shoot

prototype.update = function (dt) {
  this.execute(dt);
};

prototype.execute = function (dt) {
  if (!this._readyToFire) {
    this._reloadTime += dt;
    this._readyToFire = this._reloadTime > settings.COOLDOWN_TIME;
  }

  if (!this._target) { return; }
  if (!this.targetInLineOfSight()) { return; }

  const angle = this.rotateTowardsDirection(dt);
  if (this.targetInFieldOfFire(angle) && this._readyToFire) {
    this.fire2();
  }
};

prototype.targetInLineOfSight = function () {
  const { entity, _target } = this;
  distance.sub2(_target.getPosition(), entity.getPosition());
  return distance.length() < settings.LINE_OF_SIGHT;
};

prototype.targetInFieldOfFire = function (angle) {
  // min, max ranges could be checked here, too
  return angle >= -settings.VIEWING_ANGLE && angle <= settings.VIEWING_ANGLE;
};

prototype.fire2 = function () {
  this._reloadTime = 0;
  this._readyToFire = false;
  console.log('fire');
};

prototype.rotateTowardsDirection = function (dt) {
  const { entity, _target } = this;
  const angle = signedAngle(
    entity.forward,
    _target.getPosition().sub(entity.getPosition()),
    pc.Vec3.UP,
  );

  const alteration = dt * settings.ROTATION_SPEED;

  const result = (angle > 0)
    ? Math.min(angle, alteration)
    : -Math.min(-angle, alteration);

  this.entity.rotate(0, result, 0);
  return angle + result;
};
