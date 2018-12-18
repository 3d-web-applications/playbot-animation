import defaultUpdate from '../utils/default-update-function';
import { prototype, attributes } from './animator';

const PlaybotAnimator = pc.createScript('PlaybotAnimator');

attributes.forEach((attribute) => {
  PlaybotAnimator.attributes.add(attribute.name, attribute.object);
});

PlaybotAnimator.prototype = Object.assign(PlaybotAnimator.prototype, prototype);
// PlaybotAnimator = { ...PlaybotAnimator.prototype, prototype };

/* Object.defineProperty(PlaybotAnimator.prototype, 'animator', {
  get() {
    return this.entity.script[Animator];
  },
});

Object.defineProperty(PlaybotAnimator.prototype, 'animation', {
  get() {
    return this.entity.script[Animator];
  },
}); */

PlaybotAnimator.prototype.initialize = function () {
  console.log(Object.keys(this));
  console.log(this.animator);
  console.log(this.startIdleAnimation);
};

PlaybotAnimator.prototype.update = defaultUpdate;

PlaybotAnimator.prototype.startIdleAnimation = function (reverse) {
  this.startAnimation('Playbot_idle', reverse, true);
};

PlaybotAnimator.prototype.startRunAnimation = function (reverse) {
  this.startAnimation('Playbot_run', reverse, true);
};

PlaybotAnimator.prototype.startJumpAnimation = function (reverse) {
  this.startAnimation('Playbot_jump', reverse, true);
  this.update = this.jumpAnimation;
};

PlaybotAnimator.prototype.startDieAnimation = function (reverse) {
  this.startAnimation('Playbot_die', reverse, false);
};

PlaybotAnimator.prototype.jumpAnimation = function (/* dt */) {
  if (this.getAnimationProgress() < 1.0) {
    return;
  }

  this.update = defaultUpdate;
};
