import { createPlayerState } from './create-player-state';
import { registerFunction } from '../utils/main-loop';
import { InspectStates } from '../utils/main-loop-stages';

const PlayerController = pc.createScript('PlayerController');

PlayerController.attributes.add('_dynamicEntity', {
  type: 'entity',
  title: 'Dynamic Entity',
  description: 'Entity with a collision component and a rigid body component. The latter type must be set to dynamic!',
});

PlayerController.attributes.add('_animatedEntity', {
  type: 'entity',
  title: 'Animated Entity',
  description: 'Entity with a model component and an animation component.',
});

PlayerController.prototype.initialize = function () {
  const state = createPlayerState();

  const input = this.entity.script.PlayerInput;
  input.register(state.setForward.bind(state), 'KEY_UP');
  input.register(state.setBackward.bind(state), 'KEY_DOWN');
  input.register(state.setLeft.bind(state), 'KEY_LEFT');
  input.register(state.setRight.bind(state), 'KEY_RIGHT');
  input.register(state.setJump.bind(state), 'KEY_SPACE');

  this._playerState = state;

  const { _dynamicEntity } = this;

  this._motor = this.entity.script.PlaybotLocomotion;
  this._motor.setup(_dynamicEntity.rigidbody);

  this._tracking = this.entity.script.PlaybotMotionTracking;
  this._tracking.setup(_dynamicEntity);
  this._tracking._listener.push(this._selectActiveAnimation.bind(this));

  this._animationState = -1;

  this._animator = this.entity.script.PlaybotAnimator;
  this._animator.animation = this._animatedEntity.animation;
};

PlayerController.prototype.precision = 0.001;

PlayerController.prototype._selectActiveAnimation = function () {
  const { dx, dy, dz } = this._tracking;
  console.log(dx, dy, dz);
  if (Math.abs(dy) > this.precision) {
    console.log(0);
    if (this._animationState === 0) return;
    this._animationState = 0;
    this._animator.startJumpAnimation();
    return;
  }
  if (Math.abs(dx) < this.precision && Math.abs(dz) < this.precision) {
    console.log(2);
    if (this._animationState === 2) return;
    this._animationState = 2;
    this._animator.startIdleAnimation();
    return;
  }
  console.log(1);
  if (this._animationState === 1) return;
  this._animationState = 1;
  this._animator.startRunAnimation();
};

PlayerController.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), InspectStates);
};

PlayerController.prototype.syncedUpdate = function () {
  const {
    forward, backward, left, right, jump,
  } = this._playerState;
  const { _motor } = this;

  if (forward && !backward) {
    _motor.intensityZ = 1;
  } else if (!forward && backward) {
    _motor.intensityZ = -1;
  } else {
    _motor.intensityZ = 0;
  }

  _motor.intensityY = (jump) ? 1 : 0;

  if (left && !right) {
    _motor.intensityX = 1;
  } else if (!left && right) {
    _motor.intensityX = -1;
  } else {
    _motor.intensityX = 0;
  }
};
