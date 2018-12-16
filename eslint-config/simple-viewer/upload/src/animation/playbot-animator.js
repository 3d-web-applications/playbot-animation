import defaultUpdate from '../utils/default-update-function';

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

PlaybotAnimator.prototype.update = defaultUpdate;

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
  this.update = this.jumpAnimation;
};

PlaybotAnimator.prototype.startDieAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_die', _blendTime);
};

PlaybotAnimator.prototype.getCurrentDuration = function () {
  return this._animation.duration;
};

PlaybotAnimator.prototype.getCurrentTime = function () {
  return this._animation.currentTime;
};

PlaybotAnimator.prototype.getAnimationProgress = function () {
  return this.getCurrentTime() / this.getCurrentDuration();
};

PlaybotAnimator.prototype.jumpAnimation = function (dt) {
  if (this.getAnimationProgress() < 1.0) {
    console.log(this.getAnimationProgress());
    return;
  }

  this.update = defaultUpdate;
};
