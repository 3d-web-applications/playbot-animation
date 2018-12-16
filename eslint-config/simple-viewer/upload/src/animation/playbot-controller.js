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

PlaybotController.Idle = 0;
PlaybotController.Run = 1;
PlaybotController.Jump = 2;
PlaybotController.Die = 4;
PlaybotController.RunAndJump = PlaybotController.Run & PlaybotController.Jump;

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

  // this._playbotKeyoardInput.registerFunction(pc.KEY_UP, this._playbotAnimator.startIdleAnimation, this._playbotAnimator);
  // this._playbotKeyoardInput.registerFunction(pc.KEY_LEFT, this._playbotAnimator.startRunAnimation, this._playbotAnimator);

  // this._playbotKeyoardInput.registerFunction(pc.KEY_RIGHT, this._playbotAnimator.startJumpAnimation, this._playbotAnimator);
  // this._playbotKeyoardInput.registerFunction(pc.KEY_DOWN, this._playbotAnimator.startDieAnimation, this._playbotAnimator);

  /* this._playbotKeyoardInput.registerFunction(pc.KEY_UP, this._moveForward, this);
  this._playbotKeyoardInput.registerFunction(pc.KEY_DOWN, this._moveBackward, this);
  this._playbotKeyoardInput.registerFunction(pc.KEY_LEFT, this._rotateLeft, this);
  this._playbotKeyoardInput.registerFunction(pc.KEY_RIGHT, this._rotateRight, this); */

  /* his._playbotKeyoardInput.registerKeyDown(pc.KEY_UP, this.startRunning, this);
  //this._playbotKeyoardInput.registerKeyDown(pc.KEY_DOWN, this._moveBackward, this);
  // this._playbotKeyoardInput.registerKeyDown(pc.KEY_LEFT, this._rotateLeft, this);
  // this._playbotKeyoardInput.registerKeyDown(pc.KEY_RIGHT, this._rotateRight, this);
  this._playbotKeyoardInput.registerKeyDown(pc.KEY_SPACE, this.startJumping, this);
  this._playbotKeyoardInput.registerKeyDown(pc.KEY_ENTER, this.startDying, this);

  this._playbotKeyoardInput.registerKeyUp(pc.KEY_UP, this.stopRunning, this);
  //this._playbotKeyoardInput.registerKeyUp(pc.KEY_DOWN, this._moveBackward, this);
  // this._playbotKeyoardInput.registerKeyUp(pc.KEY_LEFT, this._rotateLeft, this);
  // this._playbotKeyoardInput.registerKeyUp(pc.KEY_RIGHT, this._rotateRight, this);
  this._playbotKeyoardInput.registerKeyUp(pc.KEY_SPACE, this.stopJumping, this);
  this._playbotKeyoardInput.registerKeyUp(pc.KEY_ENTER, this.stopDying, this); */

  this.keyboard = new pc.Keyboard(window);
};

PlaybotController.prototype.update = function (dt) {
  // Important note: this.app.keyboard.on(pc.EVENT_KEYDOWN, ..., this) would work, but its not smooth enough
  const forward = this.keyboard.isPressed(pc.KEY_UP) && !this.keyboard.isPressed(pc.KEY_DOWN);
  const backward = !this.keyboard.isPressed(pc.KEY_UP) && this.keyboard.isPressed(pc.KEY_DOWN);
  const left = this.keyboard.isPressed(pc.KEY_LEFT) && !this.keyboard.isPressed(pc.KEY_RIGHT);
  const right = !this.keyboard.isPressed(pc.KEY_LEFT) && this.keyboard.isPressed(pc.KEY_RIGHT);

  if (forward) {
    this._playbotEntity.translate(0, 0, this._translationSpeed * dt);
    this.startRunning();
  }
  if (backward) {
    this._playbotEntity.translate(0, 0, -this._translationSpeed * dt);
    this.startRunning();
  }
  if (left) {
    this._playbotEntity.rotate(0, this._rotationSpeed * dt, 0);
  }
  if (right) {
    this._playbotEntity.rotate(0, -this._rotationSpeed * dt, 0);
  }

  const standing = !this.keyboard.isPressed(pc.KEY_UP)
    && !this.keyboard.isPressed(pc.KEY_DOWN)
    && !this.keyboard.isPressed(pc.KEY_LEFT)
    && !this.keyboard.isPressed(pc.KEY_RIGHT);

  if (standing) {
    this.enterIdleState();
  }
};

PlaybotController.prototype.enterIdleState = function () {
  this.state = PlaybotController.Idle;
};

PlaybotController.prototype.startRunning = function () {
  this.state = PlaybotController.Run;
};

PlaybotController.prototype.stopRunning = function () {
  this.state = this.state & ~PlaybotController.Run;
};

PlaybotController.prototype.startJumping = function () {
  this.state = PlaybotController.Jump;
};

PlaybotController.prototype.stopJumping = function () {
  this.state = this.state & ~PlaybotController.Jump;
};

PlaybotController.prototype.startDying = function () {
  this.state = PlaybotController.Die;
};

PlaybotController.prototype.stopDying = function () {
  this.state = this.state & ~PlaybotController.Die;
};

PlaybotController.prototype._onStateChanged = function () {
  if (this._state === PlaybotController.JumpAndRun) {
    this._playbotAnimator.startJumpAnimation();
  }
  if (this.state === PlaybotController.Idle) {
    this._playbotAnimator.startIdleAnimation();
  }
  if (this._state === PlaybotController.Run) {
    this._playbotAnimator.startRunAnimation();
  }
  if (this._state === PlaybotController.Jump) {
    this._playbotAnimator.startJumpAnimation();
  }
  if (this._state === PlaybotController.Die) {
    this._playbotAnimator.startDieAnimation();
  }
};
