import { Forward, Backward } from './animation-states';
import {
  Idle, Run, Jump, Die, RunAndJump,
} from '../player/player-states';

const CharacterController = pc.createScript('CharacterController');

CharacterController.attributes.add('_playbotEntity', {
  type: 'entity',
  title: 'Playbot Entity',
  description: 'Entity with an animation component',
});

CharacterController.attributes.add('_translationSpeed', {
  type: 'number',
  default: 1,
  title: 'Translation Speed',
  description: 'Speed to move forward/backward',
});

CharacterController.attributes.add('_turnSpeed', {
  type: 'number',
  default: 0.5,
  title: 'Turn Speed',
  description: 'Forward speed while turning around',
});

CharacterController.attributes.add('_rotationSpeed', {
  type: 'number',
  default: 120,
  title: 'Rotation Speed',
  description: 'Speed to turn left/right',
});

CharacterController.prototype._playbotAnimator = null;
CharacterController.prototype._state = null;

Object.defineProperty(CharacterController.prototype, 'state', {
  get() {
    return this._state;
  },

  set(value) {
    if (this._state === value) {
      return;
    }
    this._state = value;
    this._onStateChanged();
  },
});

CharacterController.prototype.initialize = function () {
  const { script } = this.entity;
  if (!script) {
    console.error('(PlaybotController) Missing script component');
    this.entity.enabled = false;
    return;
  }

  this._playbotAnimator = script.Animator;
  this._playbotAnimator.animation = this._playbotEntity.animation;

  this.keyboard = new pc.Keyboard(window);

  this.enterIdleState();
};

CharacterController.prototype.moveLeft = function (dt) {
  this._playbotEntity.translateLocal(0, 0, this._turnSpeed * dt);
  this._playbotEntity.rotateLocal(0, this._rotationSpeed * dt, 0);
  this.enterRunningState();
};

CharacterController.prototype.moveRight = function (dt) {
  this._playbotEntity.translateLocal(0, 0, this._turnSpeed * dt);
  this._playbotEntity.rotateLocal(0, -this._rotationSpeed * dt, 0);
  this.enterRunningState();
};

CharacterController.prototype.moveForward = function (dt) {
  this._playbotEntity.translateLocal(0, 0, this._translationSpeed * dt);
  this.enterRunningState();
};

CharacterController.prototype.moveBackward = function (dt) {
  this._playbotEntity.translateLocal(0, 0, -this._translationSpeed * dt);
  this.enterRunningState();
};

CharacterController.prototype.doNothing = function () {
  this.enterIdleState();
};

CharacterController.prototype.enterIdleState = function () {
  this.state = Idle;
};

CharacterController.prototype.enterRunningState = function () {
  this.state = Run;
};

CharacterController.prototype.exitRunningState = function () {
  this.state = this.state & ~Run;
};

CharacterController.prototype.enterJumpState = function () {
  this.state = Jump;
};

CharacterController.prototype.exitJumpState = function () {
  this.state = this.state & ~Jump;
};

CharacterController.prototype.enterDieState = function () {
  this.state = Die;
};

CharacterController.prototype.exitDieState = function () {
  this.state = this.state & ~Die;
};

CharacterController.prototype._onStateChanged = function () {
  console.log(this._state, RunAndJump);
  if (this._state === RunAndJump) {
    this._playbotAnimator.startJumpAnimation(Forward);
  }
  if (this.state === Idle) {
    this._playbotAnimator.startIdleAnimation(Forward);
  }
  if (this._state === Run) {
    this._playbotAnimator.startRunAnimation(Forward);
  }
  if (this._state === Jump) {
    this._playbotAnimator.startJumpAnimation(Forward);
  }
  if (this._state === Die) {
    this._playbotAnimator.startDieAnimation(Forward);
  }
};
