import { Forward, Backward } from './animation-states';
import allowInheritance from '../utils/inherit-attributes';

const Animator = pc.createScript('Animator');

const attributes = [];

/**
 * Decorator to store attributes attached to scripts.
 * @param {Function} fn function to be decorated
 * @param {Array} attr array of attribute names and their description
 * @example
 * Animator.attributes.add = makeSafe(Animator.attributes.add, attributes);
 */
/*const makeSafe = function (fn, attr) {
  return function (...args) {
    try {
      attr.push(args);
      return fn.apply(this, args);
    } catch (ex) {
      // console.warning(ex);
      return null;
    }
  };
};

Animator.attributes.add = makeSafe(Animator.attributes.add, attributes);*/

// works only in playcanvas editor but not in preview!

/*const { add } = Animator.attributes;
//add.bind(Animator);
Animator.attributes.add = function (name, object) {
  console.log(this);
  attributes.push({ name, object });
  //Animator.attributes.add(name, object);
};*/
/*
const Add = (name, object) => {
  attributes.push({ name, object });
  Animator.attributes.add(name, object);
};

Add('_animationSpeed', {
  type: 'number',
  title: 'Start Animation Speed',
  default: 1,
  description: 'Set default animation speed',
});
Add('_blendTime', {
  type: 'number',
  title: 'Blend Time',
  default: 0,
  description: 'Time to blend between animations',
});*/

console.log(allowInheritance);
Animator.attributes.add = allowInheritance(Animator.attributes.add, attributes);

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

console.log(attributes);

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

Animator.prototype.initialize = function () {
  console.log(this._animationSpeed, this._blendTime);
};

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

//const { prototype } = Animator;

//export { prototype, attributes };
