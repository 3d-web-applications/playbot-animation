import { Forward, Backward } from './animation-states';
import collectAttributes from '../utils/collect-attributes';

const Animator = pc.createScript('Animator');

const attributes = [];
Animator.attributes.add = collectAttributes(
  Animator.attributes.add,
  attributes,
);

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
// Animator.prototype._playbackDirection = null;
Animator.prototype._time = 0;
Animator.prototype._progress = 0;
Animator.prototype._speed = 1;

Object.defineProperty(Animator.prototype, 'animation', {
  get() {
    return this._animation;
  },

  set(value) {
    this._animation = value;
  },
});

/* Object.defineProperty(Animator.prototype, 'playbackDirection', {
  get() {
    return this._playbackDirection;
  },

  set(value) {
    if (this._playbackDirection === value) {
      return;
    }
    this._playbackDirection = value;
  },
}); */

Object.defineProperty(Animator.prototype, 'time', {
  get() {
    return this._time;
  },

  set(value) {
    const duration = this.getCurrentDuration();
    // console.log(value, duration, this._animation.loop, this._animation.loop && value >= duration);
    if (this._animation.loop && value >= duration) {
      this._time = value % duration;
      this._onTimeChanged();
      return;
    }

    const clampedTime = pc.math.clamp(value, 0, duration);
    // console.log('clampedTime', clampedTime);
    if (this._time === clampedTime) {
      return;
    }

    this._time = clampedTime;
    this._onTimeChanged();
  },
});

Object.defineProperty(Animator.prototype, 'progress', {
  get() {
    return this._progress;
  },

  set(value) {
    const clampedValue = pc.math.clamp(value, 0, 1);
    if (this._progress === clampedValue) {
      return;
    }

    this._progress = clampedValue;
    this._onAnimationProgressChanged();
  },
});

Object.defineProperty(Animator.prototype, 'speed', {
  get() {
    return this._speed;
  },

  set(value) {
    this._speed = value;
  },
});

Animator.prototype.initialize = function () {
  this._animation.speed = 0;
};

Animator.prototype.startAnimation = function (animationName, reverse, loop) {
  const { _blendTime } = this;
  this._animation.play(animationName, _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  this._animation.loop = loop;
  this.time = 0;
  // console.log(this._animation.loop); // TODO jumping set to false and directly afterwards back to true
};

Animator.prototype.getCurrentDuration = function () {
  return this._animation.duration;
};

/* Animator.prototype.getCurrentTime = function () {
  return this._animation.currentTime;
};

Animator.prototype.getAnimationProgress = function () {
  return this.getCurrentTime() / this.getCurrentDuration();
};

/*Animator.prototype.onPlaybackDirectionChanged = function () {
  const { playbackDirection, _animation, _animationSpeed } = this;
  if (playbackDirection === Forward) {
    _animation.currentTime = 0;
    _animation.speed = _animationSpeed;
  } else {
    _animation.currentTime = _animation.duration - 0.01;
    _animation.speed = -_animationSpeed;
  }
}; */

Animator.prototype._onTimeChanged = function () {
  this.progress = this.time / this.getCurrentDuration();
};

Animator.prototype._onAnimationProgressChanged = function () {
  this._animation.currentTime = pc.math.lerp(
    0, this.getCurrentDuration(), this.progress,
  );
};

export { Animator, attributes };
