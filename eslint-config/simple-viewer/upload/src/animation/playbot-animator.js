import defaultUpdate from '../utils/default-update-function';

const PlaybotAnimator = pc.createScript('PlaybotAnimator');

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

Object.defineProperty(PlaybotAnimator.prototype, 'animation', {
  get() {
    return this._animation;
  },

  set(value) {
    this._animation = value;
  },
});

PlaybotAnimator.prototype.update = defaultUpdate;

PlaybotAnimator.prototype.startIdleAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_idle', _blendTime);
  _animation.loop = true;
};

PlaybotAnimator.prototype.startRunAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_run', _blendTime);
  _animation.loop = true;
};

PlaybotAnimator.prototype.startJumpAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_jump', _blendTime);
  _animation.loop = false;
  this.update = this.jumpAnimation;
};

PlaybotAnimator.prototype.startDieAnimation = function () {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_die', _blendTime);
  _animation.loop = false;
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

PlaybotAnimator.prototype.jumpAnimation = function (/* dt */) {
  if (this.getAnimationProgress() < 1.0) {
    return;
  }

  this.update = defaultUpdate;
};
