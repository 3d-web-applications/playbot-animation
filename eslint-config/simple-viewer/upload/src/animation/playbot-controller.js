import { Forward, Backward } from './animation-states';
import {
  Idle, Run, Jump, Die, RunAndJump,
} from '../player/player-states';

const PlaybotController = pc.createScript('PlaybotController');

PlaybotController.attributes.add('_playbotEntity', {
  type: 'entity',
  title: 'Playbot Entity',
  description: 'Entity with an animation component',
});

PlaybotController.attributes.add('_keyboardEntity', {
  type: 'entity',
  title: 'Keyboard Entity',
  description: 'Entity with an script listening for keyboard events',
});

PlaybotController.attributes.add('_translationSpeed', {
  type: 'number',
  default: 1,
  title: 'Translation Speed',
  description: 'Speed to move forward/backward',
});

PlaybotController.attributes.add('_turnSpeed', {
  type: 'number',
  default: 0.5,
  title: 'Turn Speed',
  description: 'Forward speed while turning around',
});

PlaybotController.attributes.add('_rotationSpeed', {
  type: 'number',
  default: 1,
  title: 'Rotation Speed',
  description: 'Speed to turn left/right',
});

PlaybotController.prototype._playbotAnimator = null;
PlaybotController.prototype._playbotJump = null;
PlaybotController.prototype._playbotKeyoardInput = null;
PlaybotController.prototype._state = null;

Object.defineProperty(PlaybotController.prototype, 'state', {
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

PlaybotController.prototype.initialize = function () {
  const { script } = this.entity;
  if (!script) {
    console.error('(PlaybotController) Missing script component');
    this.entity.enabled = false;
    return;
  }

  this._playbotAnimator = script.PlaybotAnimator;
  this._playbotJump = script.PlaybotJump;
  this._playbotKeyoardInput = this._keyboardEntity.script.PlaybotKeyboardInput;

  this._playbotAnimator.animation = this._playbotEntity.animation;

  this.keyboard = new pc.Keyboard(window);

  this.enterIdleState();
};

PlaybotController.prototype.update = function (dt) {
  // Important note: this.app.keyboard.on(pc.EVENT_KEYDOWN, ..., this) would work, but its not smooth enough
  const forward = this.keyboard.isPressed(pc.KEY_UP) && !this.keyboard.isPressed(pc.KEY_DOWN);
  const backward = !this.keyboard.isPressed(pc.KEY_UP) && this.keyboard.isPressed(pc.KEY_DOWN);
  const left = this.keyboard.isPressed(pc.KEY_LEFT) && !this.keyboard.isPressed(pc.KEY_RIGHT);
  const right = !this.keyboard.isPressed(pc.KEY_LEFT) && this.keyboard.isPressed(pc.KEY_RIGHT);
  const isTurningAround = left || right;

  if (left) {
    this._playbotEntity.translateLocal(0, 0, this._turnSpeed * dt);
    this._playbotEntity.rotateLocal(0, this._rotationSpeed * dt, 0);
    // this.enterRunningState();
  }
  if (right) {
    this._playbotEntity.translateLocal(0, 0, this._turnSpeed * dt);
    this._playbotEntity.rotateLocal(0, -this._rotationSpeed * dt, 0);
    // this.enterRunningState();
  }

  if (forward && !isTurningAround) {
    this._playbotEntity.translateLocal(0, 0, this._translationSpeed * dt);
    // this.enterRunningState();
  }
  if (backward && !isTurningAround) {
    this._playbotEntity.translateLocal(0, 0, -this._translationSpeed * dt);
    // this.enterRunningState();
  }

  /* if (left || right) {
    if (forward) this.enterRunningState(); else this.enterIdleState();
  } */

  const isMoving = this.keyboard.isPressed(pc.KEY_UP)
    || this.keyboard.isPressed(pc.KEY_DOWN)
    || this.keyboard.isPressed(pc.KEY_LEFT)
    || this.keyboard.isPressed(pc.KEY_RIGHT);

  if (isMoving) this.enterRunningState(); else this.enterIdleState();
};

PlaybotController.prototype.enterIdleState = function () {
  this.state = Idle;
};

PlaybotController.prototype.enterRunningState = function () {
  this.state = Run;
};

PlaybotController.prototype.exitRunningState = function () {
  this.state = this.state & ~Run;
};

PlaybotController.prototype.enterJumpState = function () {
  this.state = Jump;
};

PlaybotController.prototype.exitJumpState = function () {
  this.state = this.state & ~Jump;
};

PlaybotController.prototype.enterDieState = function () {
  this.state = PlaybotController.Die;
};

PlaybotController.prototype.exitDieState = function () {
  this.state = this.state & ~Die;
};

PlaybotController.prototype._onStateChanged = function () {
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
