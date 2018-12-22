import defaultUpdate from '../utils/default-update-function';
import { Animator, attributes } from './animator';
import extendScript from '../utils/extend-script';

const PlaybotAnimator = pc.createScript('PlaybotAnimator');
extendScript(PlaybotAnimator, Animator, attributes);

// PlaybotAnimator.prototype.listener = null;
PlaybotAnimator.prototype._playbotJumpAnimator = null;

PlaybotAnimator.prototype.initialize = function () {
  this.super();
  this._playbotJumpAnimator = this.entity.script.PlaybotJump;
};

// PlaybotAnimator.prototype.update = defaultUpdate;

PlaybotAnimator.prototype.startIdleAnimation = function (reverse) {
  this.startAnimation('Playbot_idle', reverse, true);
};

PlaybotAnimator.prototype.startRunAnimation = function (reverse) {
  this.startAnimation('Playbot_run', reverse, true);
};

PlaybotAnimator.prototype.startJumpAnimation = function (reverse) {
  this.startAnimation('Playbot_jump', reverse, false);
  // this.update = this.jumpAnimation;
};

PlaybotAnimator.prototype.startDieAnimation = function (reverse) {
  this.startAnimation('Playbot_die', reverse, false);
};

// PlaybotAnimator.prototype.jumpAnimation = function (/* dt */) {
//   const progress = this.getAnimationProgress();
//   console.log(progress);
//   if (progress < 1.0) {
//     // this._onJumpProgressChanged(progress);
//     this._playbotJumpAnimator.onTimeChanged(progress);
//     return;
//   }

//   // this._onJumpProgressChanged(1);
//   this._playbotJumpAnimator.onTimeChanged(progress);

//   this.update = defaultUpdate;
// };

// PlaybotAnimator.prototype._onJumpProgressChanged = function (progress) {
//   // this.listener.onTimeChanged(progress);
//   this._playbotJumpAnimator.onTimeChanged(progress);
// };
