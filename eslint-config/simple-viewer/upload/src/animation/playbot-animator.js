import { Animator, attributes } from './animator';
import extendScript from '../utils/extend-script';
import { addAnimator } from '../utils/main-loop';

const PlaybotAnimator = pc.createScript('PlaybotAnimator');
extendScript(PlaybotAnimator, Animator, attributes);

// PlaybotAnimator.prototype.listener = null;
PlaybotAnimator.prototype._playbotJumpAnimator = null;

PlaybotAnimator.prototype.initialize = function () {
  this.super();
  this._playbotJumpAnimator = this.entity.script.PlaybotJump;
};

PlaybotAnimator.prototype.postInitialize = function () {
  addAnimator(this.syncedUpdate.bind(this));
};

PlaybotAnimator.prototype.syncedUpdate = function (dt) {
  this.time += (dt * this.speed);
};

// PlaybotAnimator.prototype.update = defaultUpdate;

PlaybotAnimator.prototype.startIdleAnimation = function (reverse) {
  this.startAnimation('Playbot_idle', reverse, true);
  this.speed = 1;
};

PlaybotAnimator.prototype.startRunAnimation = function (reverse) {
  this.startAnimation('Playbot_run', reverse, true);
  this.speed = 1;
};

PlaybotAnimator.prototype.startJumpAnimation = function (reverse, length) {
  this.startAnimation('Playbot_jump', reverse, false);
  // this.update = this.jumpAnimation;
  this.speed = this.getCurrentDuration() / length;
};

PlaybotAnimator.prototype.startDieAnimation = function (reverse) {
  this.startAnimation('Playbot_die', reverse, false);
  this.speed = 1;
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
