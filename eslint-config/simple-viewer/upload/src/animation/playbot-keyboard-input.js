const PlaybotKeyboardInput = pc.createScript('PlaybotKeyboardInput');

/* PlaybotKeyboardInput.prototype._playbotAnimator = null;
PlaybotKeyboardInput.prototype._playbotJump = null;

PlaybotKeyboardInput.prototype.initialize = function () {
  const { entity, app, _onKeyDown } = this;
  const hasPlaybotAnimator = entity
    && entity.script
    && entity.script.PlaybotAnimator;

  this._playbotAnimator = (hasPlaybotAnimator)
    ? entity.script.PlaybotAnimator : null;

  this._playbotJump = (hasPlaybotAnimator)
    ? entity.script.PlaybotJump : null;

  app.keyboard.on(pc.EVENT_KEYDOWN, _onKeyDown, this);
};

PlaybotKeyboardInput.prototype._onKeyDown = function (event) {
  if (event.key === pc.KEY_UP) {
    this._playbotAnimator.startIdleAnimation();
  }
  if (event.key === pc.KEY_LEFT) {
    this._playbotAnimator.startRunAnimation();
  }
  if (event.key === pc.KEY_RIGHT) {
    this._playbotAnimator.startJumpAnimation();
    console.log(this._playbotAnimator.getCurrentDuration());
    console.log(this._playbotAnimator.getCurrentTime());
  }
  if (event.key === pc.KEY_DOWN) {
    this._playbotAnimator.startDieAnimation();
  }

  event.event.preventDefault();
}; */

PlaybotKeyboardInput.prototype._functionRegister = {};

PlaybotKeyboardInput.prototype.initialize = function () {
  this.app.keyboard.on(pc.EVENT_KEYDOWN, this._onKeyDown, this);
};

PlaybotKeyboardInput.prototype._onKeyDown = function (event) {
  const { _functionRegister } = this;
  const keys = Object.keys(_functionRegister);
  keys.forEach((key) => {
    if (event.key.toString() === key) {
      const subscribers = _functionRegister[key];
      subscribers.forEach((func) => {
        func();
      });
    }
  });
};

PlaybotKeyboardInput.prototype.registerFunction = function (key, callback, scope) {
  const func = callback.bind(scope);
  if (this._functionRegister[key]) {
    this._functionRegister[key].push(func);
  } else {
    this._functionRegister[key] = [func];
  }
};
