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
};

PlayerController.prototype.precision = 0.001;

PlayerController.prototype._selectActiveAnimation = function () {
  const { PlaybotMotionTracking } = this.entity.script;

  if (Math.abs(PlaybotMotionTracking.dy) > this.precision) {
    this.animationState = 0;
    return;
  }

  if (Math.abs(PlaybotMotionTracking.dx) < this.precision
    && Math.abs(PlaybotMotionTracking.dz) < this.precision) {
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

PlayerController.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), InspectStates);
};

PlayerController.prototype.syncedUpdate = function () {
  const { entity, _playerState } = this;
  const {
    forward, backward, left, right, jump,
  } = _playerState;
  const { PlaybotLocomotion } = entity.script;

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
