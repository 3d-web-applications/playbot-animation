import { Forward, Backward } from './animation-states';

const Animator = pc.createScript('Animator');

// works only in playcanvas editor but not in preview!
const attributes = [];
const { add } = Animator.attributes;
Animator.attributes.add = (name, object) => {
  attributes.push({ name, object });
  add(name, object);
};

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

Animator.prototype.startAnimation = function (animationName, reverse, loop) {
  const { _animation, _blendTime } = this;
  _animation.play(animationName, _blendTime);
  this.playbackDirection = (reverse) ? Backward : Forward;
  _animation.loop = loop;
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

Animator.prototype.onPlaybackDirectionChanged = function () {
  console.log(this);
  const { playbackDirection, _animation, _animationSpeed } = this;
  if (playbackDirection === Forward) {
    _animation.currentTime = 0;
    _animation.speed = _animationSpeed;
  } else {
    _animation.currentTime = _animation.duration - 0.01;
    _animation.speed = -_animationSpeed;
  }
};

const { prototype } = Animator;

export { prototype, attributes };
