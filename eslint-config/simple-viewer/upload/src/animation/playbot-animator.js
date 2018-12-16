const PlaybotAnimator = pc.createScript('PlaybotAnimator');

PlaybotAnimator.attributes.add('_playbotEntity', {
  type: 'entity',
  title: 'Playbot Entity',
  description: 'Entity with an animation component',
});

PlaybotAnimator.attributes.add('_animationSpeed', {
  type: 'number',
  title: 'Start Animation Speed',
  default: 1,
  description: 'Set default animation speed',
});

PlaybotAnimator.attributes.add('_blendTime', {
  type: 'number',
  title: 'Blend Time',
  default: 0,
  description: 'Time to blend between animations',
});

PlaybotAnimator.prototype._animation = null;

PlaybotAnimator.prototype.initialize = function () {
  this._animation = this._playbotEntity.animation;
};

PlaybotAnimator.prototype.startIdleAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_idle', _blendTime);
};

PlaybotAnimator.prototype.startRunAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_run', _blendTime);
};

PlaybotAnimator.prototype.startJumpAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_jump', _blendTime);
};

PlaybotAnimator.prototype.startDieAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_die', _blendTime);
};
