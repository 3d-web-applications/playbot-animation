import defaultUpdate from '../utils/default-update-function';
import { Animator, attributes } from './animator';
import extend from '../utils/extend-from-script';

const PlaybotAnimator = pc.createScript('PlaybotAnimator');
extend(PlaybotAnimator, Animator, attributes);

PlaybotAnimator.prototype.initialize = function () {
  this.super();
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
