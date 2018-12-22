const PlayerInput = pc.createScript('PlayerInput');

PlayerInput.attributes.add('_characterControllerEntity', {
  type: 'entity',
  title: 'Character Controller',
  description: 'Entity with a character controller script',
});

PlayerInput.prototype._controller = null;

PlayerInput.prototype.initialize = function () {
  this._keyboard = new pc.Keyboard(window);
  // this._controller = this._characterControllerEntity.script.CharacterController;
  this._player = this.entity.script.PlayerController;
};

PlayerInput.prototype.update = function (dt) {
  // Important note: this.app.keyboard.on(pc.EVENT_KEYDOWN, ..., this) would work, but its not smooth enough
  const { _keyboard, _controller, _player } = this;
  const forward = _keyboard.isPressed(pc.KEY_UP);
  const backward = _keyboard.isPressed(pc.KEY_DOWN);
  const left = _keyboard.isPressed(pc.KEY_LEFT);
  const right = _keyboard.isPressed(pc.KEY_RIGHT);
  const jump = _keyboard.isPressed(pc.KEY_SPACE);

  if (left && !right) {
    // _controller.moveLeft(dt);
    _player.tryToRunLeft();
    return;
  }
  if (!left && right) {
    // controller.moveRight(dt);
    _player.tryToRunRight();
    return;
  }
  if (forward && !backward) {
    // _controller.moveForward(dt);
    _player.tryToRunForward();
    return;
  }
  if (!forward && backward) {
    // _controller.moveBackward(dt);
    _player.tryToRunBackward();
    return;
  }
  if (jump) {
    // _controller.enterJumpState();
    _player.tryToJump();
    return;
  }

  //_controller.doNothing();
  _player.tryToIdle();
};
