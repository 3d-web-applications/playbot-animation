import defaultUpdate from '../utils/default-update-function';
import { Forward, Backward } from './animation-states';

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
PlaybotAnimator.prototype._playbackDirection = null;

Object.defineProperty(PlaybotAnimator.prototype, 'animation', {
  get() {
    return this._animation;
  },

  set(value) {
    this._animation = value;
  },
});

Object.defineProperty(PlaybotAnimator.prototype, 'playbackDirection', {
  get() {
    return this._playbackDirection;
  },

  set(value) {
    if (this._playbackDirection === value) {
      return;
    }
    this._playbackDirection = value;
  },
});

PlaybotAnimator.prototype.update = defaultUpdate;

PlaybotAnimator.prototype.startIdleAnimation = function (reverse) {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_idle', _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = true;
};

PlaybotAnimator.prototype.startRunAnimation = function (reverse) {
  const { _animation, _blendTime/* , _animationSpeed */ } = this;
  _animation.play('Playbot_run', _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = true;
};

PlaybotAnimator.prototype.startJumpAnimation = function (reverse) {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_jump', _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = false;
  this.update = this.jumpAnimation;
};

PlaybotAnimator.prototype.startDieAnimation = function (reverse) {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_die', _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
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

PlaybotAnimator.prototype.onPlaybackDirectionChanged = function () {
  const { playbackDirection, _animation, _animationSpeed } = this;
  if (playbackDirection === Forward) {
    _animation.currentTime = 0;
    _animation.speed = _animationSpeed;
  } else {
    _animation.currentTime = _animation.duration - 0.01;
    _animation.speed = -_animationSpeed;
  }
};
