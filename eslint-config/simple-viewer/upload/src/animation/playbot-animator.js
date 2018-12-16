import defaultUpdate from '../utils/default-update-function';
import { Forward, Backward } from './animation-states';

const Animator = pc.createScript('Animator');

Animator.attributes.add('_animationSpeed', {
  type: 'number',
  title: 'Start Animation Speed',
  default: 1,
  description: 'Set default animation speed',
});

Animator.attributes.add('_blendTime', {
  type: 'number',
  title: 'Blend Time',
  default: 0,
  description: 'Time to blend between animations',
});

Animator.prototype._animation = null;
Animator.prototype._playbackDirection = null;

Object.defineProperty(Animator.prototype, 'animation', {
  get() {
    return this._animation;
  },

  set(value) {
    this._animation = value;
  },
});

Object.defineProperty(Animator.prototype, 'playbackDirection', {
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

Animator.prototype.update = defaultUpdate;

Animator.prototype.startAnimation = function (animationName, reverse, loop) {
  const { _animation, _blendTime } = this;
  _animation.play(animationName, _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = loop;
};

Animator.prototype.startIdleAnimation = function (reverse) {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_idle', _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = true;
};

Animator.prototype.startRunAnimation = function (reverse) {
  const { _animation, _blendTime/* , _animationSpeed */ } = this;
  _animation.play('Playbot_run', _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = true;
};

Animator.prototype.startJumpAnimation = function (reverse) {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_jump', _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = false;
  this.update = this.jumpAnimation;
};

Animator.prototype.startDieAnimation = function (reverse) {
  const { _animation, _blendTime } = this;
  _animation.play('Playbot_die', _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = false;
};

Animator.prototype.getCurrentDuration = function () {
  return this._animation.duration;
};

Animator.prototype.getCurrentTime = function () {
  return this._animation.currentTime;
};

Animator.prototype.getAnimationProgress = function () {
  return this.getCurrentTime() / this.getCurrentDuration();
};

Animator.prototype.jumpAnimation = function (/* dt */) {
  if (this.getAnimationProgress() < 1.0) {
    return;
  }

  this.update = defaultUpdate;
};

Animator.prototype.onPlaybackDirectionChanged = function () {
  const { playbackDirection, _animation, _animationSpeed } = this;
  if (playbackDirection === Forward) {
    _animation.currentTime = 0;
    _animation.speed = _animationSpeed;
  } else {
    _animation.currentTime = _animation.duration - 0.01;
    _animation.speed = -_animationSpeed;
  }
};
