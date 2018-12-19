import defaultUpdate from '../utils/default-update-function';
import { prototype, attributes, Animator } from './animator';

const PlaybotAnimator = pc.createScript('PlaybotAnimator');

attributes.forEach((attribute) => {
  PlaybotAnimator.attributes.add(attribute.name, attribute.object);
});

PlaybotAnimator.prototype = Object.create(
  Object.getPrototypeOf(Animator.prototype),
  Object.getOwnPropertyDescriptors(Animator.prototype),
);

PlaybotAnimator.prototype.initialize = function () {
  console.log(this);
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
