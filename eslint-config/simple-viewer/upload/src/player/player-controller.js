import { createPlayerState } from './create-player-state';
import { registerFunction } from '../utils/main-loop';
import { InspectStates } from '../utils/main-loop-stages';

const PlayerController = pc.createScript('PlayerController');

PlayerController.attributes.add('_dynamicEntity', {
  type: 'entity',
  title: 'Dynamic Entity',
  description: `Entity with a collision component and a rigid body
   component. The latter type must be set to dynamic!`,
});

PlayerController.attributes.add('_animatedEntity', {
  type: 'entity',
  title: 'Animated Entity',
  description: 'Entity with a model component and an animation component.',
});

Object.defineProperty(PlayerController.prototype, 'animationState', {
  get() {
    return this._animationState;
  },

  set(value) {
    if (value === this._animationState) {
      return;
    }
    this._animationState = value;
    this._onAnimationStateChanged();
  },
});

PlayerController.prototype._precision = 0.001;

PlayerController.prototype.initialize = function () {
  const { entity, _dynamicEntity } = this;
  const {
    PlayerInput, PlaybotLocomotion, PlaybotMotionTracking, PlaybotAnimator,
  } = entity.script;

  this._animationState = -1;

  const state = createPlayerState();
  this._playerState = state;

  PlayerInput.register(state.setForward.bind(state), 'KEY_UP');
  PlayerInput.register(state.setBackward.bind(state), 'KEY_DOWN');
  PlayerInput.register(state.setLeft.bind(state), 'KEY_LEFT');
  PlayerInput.register(state.setRight.bind(state), 'KEY_RIGHT');
  PlayerInput.register(state.setJump.bind(state), 'KEY_SPACE');

  PlaybotLocomotion.setup(_dynamicEntity.rigidbody);

  PlaybotMotionTracking.setup(_dynamicEntity);
  PlaybotMotionTracking._listener.push(this._selectActiveAnimation.bind(this));

  PlaybotAnimator.animation = this._animatedEntity.animation;

  _dynamicEntity.collision.on('collisionstart', this._onGroundEntered, this);
  _dynamicEntity.collision.on('collisionend', this._onGroundLeft, this);
};

PlayerController.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), InspectStates);
};

PlayerController.prototype.syncedUpdate = function () {
  const { entity, _playerState } = this;
  const {
    forward, backward, left, right, jump,
  } = _playerState;
  const { PlaybotLocomotion } = entity.script;

  PlaybotLocomotion.intensityZ = this._computeIntensity(forward, backward);
  PlaybotLocomotion.intensityY = (jump) ? 1 : 0;
  PlaybotLocomotion.intensityX = this._computeIntensity(left, right);
};

PlayerController.prototype._computeIntensity = function (flagA, flagB) {
  if (flagA === flagB) {
    return 0;
  }
  return (flagA) ? 1 : -1;
};

PlayerController.prototype._selectActiveAnimation = function () {
  const { entity, _precision } = this;
  const { PlaybotMotionTracking } = entity.script;

  if (Math.abs(PlaybotMotionTracking.dy) > _precision) {
    this.animationState = 0;
    return;
  }

  if (Math.abs(PlaybotMotionTracking.dx) < _precision
    && Math.abs(PlaybotMotionTracking.dz) < _precision) {
    this.animationState = 2;
    return;
  }

  this.animationState = 1;
};

PlayerController.prototype._onAnimationStateChanged = function () {
  const { PlaybotAnimator } = this.entity.script;
  switch (this.animationState) {
    case 2:
      PlaybotAnimator.startIdleAnimation();
      break;
    case 1:
      PlaybotAnimator.startRunAnimation();
      break;
    case 0:
      PlaybotAnimator.startJumpAnimation();
      break;
    default:
      break;
  }
};

PlayerController.prototype._onGroundEntered = function () {
  // console.log('_onGroundEntered');
  this._onGround = true;
};

PlayerController.prototype._onGroundLeft = function () {
  // console.log('_onGroundLeft');
  this._onGround = false;
};
