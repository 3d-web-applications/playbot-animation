const PlayerInput = pc.createScript('PlayerInput');

PlayerInput.attributes.add('_playbotEntity', {
  type: 'entity',
  title: 'Playbot Entity',
  description: 'Entity with an animation component',
});

PlayerInput.prototype._controller = null;

PlayerInput.prototype.initialize = function () {
  this._keyboard = new pc.Keyboard(window);
  this._controller = this._playbotEntity.script.PlaybotController;
};

PlayerInput.prototype.update = function (dt) {
  // Important note: this.app.keyboard.on(pc.EVENT_KEYDOWN, ..., this) would work, but its not smooth enough
  const { _keyboard, _controller } = this;
  const forward = _keyboard.isPressed(pc.KEY_UP);
  const backward = _keyboard.isPressed(pc.KEY_DOWN);
  const left = _keyboard.isPressed(pc.KEY_LEFT);
  const right = _keyboard.isPressed(pc.KEY_RIGHT);

  if (left && !right) {
    _controller.moveLeft(dt);
    return;
  }
  if (!left && right) {
    _controller.moveRight(dt);
    return;
  }
  if (forward && !backward) {
    _controller.moveForward(dt);
    return;
  }
  if (!forward && backward) {
    _controller.moveBackward(dt);
    return;
  }

  _controller.doNothing();
};
