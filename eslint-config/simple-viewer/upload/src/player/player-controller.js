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

  this.evaluator = this.entity.script.PlaybotMotionTracking;
  this.evaluator._listener.push(this._selectActiveAnimation.bind(this));

  this.animationState = -1;

  this.animator = this.entity.script.PlaybotAnimator;
  this.animator.animation = this._animatedEntity.animation;

  this.playerState = state;
};

PlayerController.prototype.precision = 0.001;

PlayerController.prototype._selectActiveAnimation = function () {
  const { dx, dy, dz } = this.evaluator;
  console.log(dx, dy, dz);
  if (Math.abs(dy) > this.precision) {
    console.log(0);
    if (this.animationState === 0) return;
    this.animationState = 0;
    this.animator.startJumpAnimation();
    return;
  }
  if (Math.abs(dx) < this.precision && Math.abs(dz) < this.precision) {
    console.log(2);
    if (this.animationState === 2) return;
    this.animationState = 2;
    this.animator.startIdleAnimation();
    return;
  }
  console.log(1);
  if (this.animationState === 1) return;
  this.animationState = 1;
  this.animator.startRunAnimation();
};

PlayerController.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), InspectStates);
};

PlayerController.prototype.syncedUpdate = function () {
  const {
    forward, backward, left, right, jump,
  } = this.playerState;

  // console.log(forward, backward, left, right, jump);

  const motor = this.entity.script.PlaybotLocomotion;
  if (forward && !backward) {
    motor.intensityZ = 1;
  } else if (!forward && backward) {
    motor.intensityZ = -1;
  } else {
    motor.intensityZ = 0;
  }

  motor.intensityY = (jump) ? 1 : 0;

  if (left && !right) {
    motor.intensityX = 1;
  } else if (!left && right) {
    motor.intensityX = -1;
  } else {
    motor.intensityX = 0;
  }
};
