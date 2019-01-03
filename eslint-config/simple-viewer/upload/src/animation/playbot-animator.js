import { Animator, attributes } from './animator';
import extendScript from '../utils/extend-script';
import { registerFunction } from '../utils/main-loop';
import { RefreshView } from '../utils/main-loop-stages';

const PlaybotAnimator = pc.createScript('PlaybotAnimator');
extendScript(PlaybotAnimator, Animator, attributes);

PlaybotAnimator.prototype._playbotJumpAnimator = null;

PlaybotAnimator.prototype.initialize = function () {
  this.super();
  this._playbotJumpAnimator = this.entity.script.PlaybotJump;
  this.startIdleAnimation();
};

PlaybotAnimator.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), RefreshView);
};

PlaybotAnimator.prototype.syncedUpdate = function (dt) {
  this.time += (dt * this.speed);
};

PlaybotAnimator.prototype.startIdleAnimation = function () {
  this.startAnimation('Playbot_idle', true);
  this.speed = 1;
};

PlaybotAnimator.prototype.startRunAnimation = function () {
  this.startAnimation('Playbot_run', true);
  this.speed = 1;
};

PlaybotAnimator.prototype.startJumpAnimation = function (length) {
  this.startAnimation('Playbot_jump', false);
  this.speed = this.getCurrentDuration() / length;
};

PlaybotAnimator.prototype.startDieAnimation = function () {
  this.startAnimation('Playbot_die', false);
  this.speed = 1;
};
