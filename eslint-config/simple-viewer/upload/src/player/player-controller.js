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
  const {
    PlayerInput, PlaybotLocomotion, PlaybotMotionTracking, PlaybotAnimator,
  } = this.entity.script;
  const state = createPlayerState();

  PlayerInput.register(state.setForward.bind(state), 'KEY_UP');
  PlayerInput.register(state.setBackward.bind(state), 'KEY_DOWN');
  PlayerInput.register(state.setLeft.bind(state), 'KEY_LEFT');
  PlayerInput.register(state.setRight.bind(state), 'KEY_RIGHT');
  PlayerInput.register(state.setJump.bind(state), 'KEY_SPACE');

  this._playerState = state;

  const { _dynamicEntity } = this;

  PlaybotLocomotion.setup(_dynamicEntity.rigidbody);

  PlaybotMotionTracking.setup(_dynamicEntity);
  PlaybotMotionTracking._listener.push(this._selectActiveAnimation.bind(this));

  this._animationState = -1;

  PlaybotAnimator.animation = this._animatedEntity.animation;
};

PlayerController.prototype.precision = 0.001;

PlayerController.prototype._selectActiveAnimation = function () {
  const { PlaybotMotionTracking, PlaybotAnimator } = this.entity.script;

  console.log(PlaybotMotionTracking.dx, PlaybotMotionTracking.dy, PlaybotMotionTracking.dz);
  if (Math.abs(PlaybotMotionTracking.dy) > this.precision) {
    console.log(0);
    if (this._animationState === 0) return;
    this._animationState = 0;
    PlaybotAnimator.startJumpAnimation();
    return;
  }
  if (Math.abs(PlaybotMotionTracking.dx) < this.precision && Math.abs(PlaybotMotionTracking.dz) < this.precision) {
    console.log(2);
    if (this._animationState === 2) return;
    this._animationState = 2;
    PlaybotAnimator.startIdleAnimation();
    return;
  }
  console.log(1);
  if (this._animationState === 1) return;
  this._animationState = 1;
  PlaybotAnimator.startRunAnimation();
};

PlayerController.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), InspectStates);
};

PlayerController.prototype.syncedUpdate = function () {
  const {
    forward, backward, left, right, jump,
  } = this._playerState;
  const { PlaybotLocomotion } = this.entity.script;

  if (forward && !backward) {
    PlaybotLocomotion.intensityZ = 1;
  } else if (!forward && backward) {
    PlaybotLocomotion.intensityZ = -1;
  } else {
    PlaybotLocomotion.intensityZ = 0;
  }

  PlaybotLocomotion.intensityY = (jump) ? 1 : 0;

  if (left && !right) {
    PlaybotLocomotion.intensityX = 1;
  } else if (!left && right) {
    PlaybotLocomotion.intensityX = -1;
  } else {
    PlaybotLocomotion.intensityX = 0;
  }
};
