const PlaybotController = pc.createScript('PlaybotController');

PlaybotController.attributes.add('_playbotEntity', {
  type: 'entity',
  title: 'Playbot Entity',
  description: 'Entity with an animation component',
});

PlaybotController.prototype._playbotAnimator = null;
PlaybotController.prototype._playbotJump = null;
PlaybotController.prototype._playbotKeyoardInput = null;

PlaybotController.prototype.initialize = function () {
  const { script } = this.entity;
  if (!script) {
    console.error('(PlaybotController) Missing script component');
    this.entity.enabled = false;
    return;
  }

  this._playbotAnimator = script.PlaybotAnimator;
  this._playbotJump = script.PlaybotJump;
  this._playbotKeyoardInput = script.PlaybotKeyboardInput;

  console.log(this._playbotEntity.animation);

  this._playbotAnimator.animation = this._playbotEntity.animation;

  this._playbotKeyoardInput.registerFunction(pc.KEY_UP, this._playbotAnimator.startIdleAnimation, this._playbotAnimator);
  this._playbotKeyoardInput.registerFunction(pc.KEY_LEFT, this._playbotAnimator.startRunAnimation, this._playbotAnimator);

  this._playbotKeyoardInput.registerFunction(pc.KEY_RIGHT, this._playbotAnimator.startJumpAnimation, this._playbotAnimator);
  this._playbotKeyoardInput.registerFunction(pc.KEY_DOWN, this._playbotAnimator.startDieAnimation, this._playbotAnimator);
};
