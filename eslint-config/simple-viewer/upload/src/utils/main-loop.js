import { addToRegistry } from './add-to-registry';

const MainLoop = pc.createScript('MainLoop');

MainLoop.prototype._userInputs = [];
MainLoop.prototype._controllers = [];
MainLoop.prototype._animators = [];

MainLoop.instance = null;

MainLoop.prototype.initialize = function () {
  if (MainLoop.instance) {
    // console.error('MainLoop already exist');
    this.addUserInput = MainLoop.instance.addUserInput;
    this.addController = MainLoop.instance.addController;
    this.addAnimator = MainLoop.instance.addAnimator;
    this.enabled = false;
  }

  MainLoop.instance = this;
};

MainLoop.prototype.addUserInput = function (script) {
  return (!script) ? -1 : addToRegistry(script.syncedUpdate, this._userInputs);
};

MainLoop.prototype.addController = function (script) {
  return (!script) ? -1 : addToRegistry(script.syncedUpdate, this._controllers);
};

MainLoop.prototype.addAnimator = function (script) {
  return (!script) ? -1 : addToRegistry(script.syncedUpdate, this._animators);
};

MainLoop.prototype.update = function (dt) {
  this._userInputs.forEach((syncedUpdate) => {
    syncedUpdate(dt);
  });
  this._controllers.forEach((syncedUpdate) => {
    syncedUpdate(dt);
  });
  this._animators.forEach((syncedUpdate) => {
    syncedUpdate(dt);
  });
};
