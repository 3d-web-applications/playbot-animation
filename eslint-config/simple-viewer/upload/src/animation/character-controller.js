import { addController } from '../utils/main-loop';
import { PlayerState } from '../player/player-states';

import {
  Forward, /* Backward, */Idle, Run, Jump, Die, RunAndJump,
} from './animation-states';

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

CharacterController.attributes.add('_jumpTransition', {
  type: 'curve',
  default: {
    keys: [
      0.0, 0.0,
      0.5, 1.0,
      1.0, 0.0,
    ],
  },
  title: 'Jump Transition',
  description: 'Height change over time',
});

CharacterController.prototype._playbotAnimator = null;
CharacterController.prototype._state = null;
CharacterController.prototype._playerController = null;
CharacterController.prototype._timeInAir = 0;
CharacterController.prototype._takeoffHeight = null;
CharacterController.prototype._currentGroundDistance = null;

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

  this._playbotAnimator = script.PlaybotAnimator;
  this._playbotAnimator.animation = this._playbotEntity.animation;
  this._playerController = script.PlayerController;

  // this.keyboard = new pc.Keyboard(window);

  this._takeoffHeight = 0;
  this._currentGroundDistance = 0;

  this.enterIdleState();
};

CharacterController.prototype.postInitialize = function () {
  addController(this.syncedUpdate.bind(this));
};

CharacterController.prototype.syncedUpdate = function (dt) {
  this._checkPlayerState(dt);
};

CharacterController.prototype._checkPlayerState = function (dt) {
  const { state } = this._playerController;
  if (state & PlayerState.OnGround) {
    this.jump(dt);
  } else if (state & PlayerState.Forward) {
    this.moveForward(dt);
  } else if (state & PlayerState.Backward) {
    this.moveBackward(dt);
  } else if (state & PlayerState.Left) {
    this.moveLeft(dt);
  } else if (state & PlayerState.Right) {
    this.moveRight(dt);
  } else {
    this.doNothing(dt);
  }
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

CharacterController.prototype.jump = function (dt) {
  if (this._timeInAir === 0) {
    this.enterJumpState();
    this._timeInAir += dt;
    this.onTimeChanged(this._timeInAir / 5);
    return;
  }

  this._timeInAir += dt;

  if (this._timeInAir >= 5) {
    this.exitJumpState();
    this.onTimeChanged(0);
  } else {
    this.onTimeChanged(this._timeInAir / 5);
  }
};

CharacterController.prototype.onTimeChanged = function (normalizedTime) {
  const position = this._playbotEntity.getPosition();
  this._playbotEntity.setPosition(
    position.x,
    this._jumpTransition.value(normalizedTime),
    position.z,
  );
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
  this._timeInAir = 0;
};

CharacterController.prototype.exitJumpState = function () {
  this.state = this.state & ~Jump;
  this._timeInAir = 0;
  this._playerController._state &= ~PlayerState.Jump;
};

CharacterController.prototype.enterDieState = function () {
  this.state = Die;
};

CharacterController.prototype.exitDieState = function () {
  this.state = this.state & ~Die;
};

CharacterController.prototype._onStateChanged = function () {
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
    this._playbotAnimator.startJumpAnimation(Forward, 5);
  }
  if (this._state === Die) {
    this._playbotAnimator.startDieAnimation(Forward);
  }
};
