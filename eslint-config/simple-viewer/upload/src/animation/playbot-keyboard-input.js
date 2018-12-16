const PlaybotKeyboardInput = pc.createScript('PlaybotKeyboardInput');

PlaybotKeyboardInput.prototype._playbotAnimator = null;

PlaybotKeyboardInput.prototype.initialize = function () {
  const { entity, app, _onKeyDown } = this;
  const hasPlaybotAnimator = entity
    && entity.script
    && entity.script.PlaybotAnimator;

  this._playbotAnimator = (hasPlaybotAnimator)
    ? entity.script.PlaybotAnimator : null;

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
  }
  if (event.key === pc.KEY_DOWN) {
    this._playbotAnimator.startDieAnimation();
  }

  event.event.preventDefault();
};
