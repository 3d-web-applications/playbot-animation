import { base } from './animator';
import { extendScript } from '../utils/extend-script';
import { registerFunction } from '../utils/main-loop';
import { RefreshView } from '../utils/main-loop-stages';

const script = pc.createScript('PlaybotAnimator');
extendScript(script, base);
const { prototype } = script;

prototype._playbotJumpAnimator = null;

prototype.initialize = function () {
  this.super();
  this._playbotJumpAnimator = this.entity.script.PlaybotJump;
  this.startIdleAnimation();
};

prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), RefreshView);
};

prototype.syncedUpdate = function (dt) {
  this.time += (dt * this.speed);
};

prototype.startIdleAnimation = function () {
  this.startAnimation('Playbot_idle', true);
  this.speed = 1;
};

prototype.startRunAnimation = function () {
  this.startAnimation('Playbot_run', true);
  // this.speed = 1;
  // this.speed = 0;
};

prototype.startJumpAnimation = function () {
  this.startAnimation('Playbot_jump', false);
  this.speed = 0;
};

prototype.startDieAnimation = function () {
  this.startAnimation('Playbot_die', false);
  this.speed = 1;
};
