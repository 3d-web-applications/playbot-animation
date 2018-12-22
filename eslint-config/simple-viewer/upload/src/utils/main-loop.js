import { addToRegistry } from './add-to-registry';

const MainLoop = pc.createScript('MainLoop');

MainLoop.prototype._userInputs = [];
MainLoop.prototype._controllers = [];
MainLoop.prototype._animators = [];

/* MainLoop.prototype.addSubscriber = function (script, array) {
  if (!script.syncedUpdate || typeof script.syncedUpdate !== 'function') {
    return -1;
  }

  array.push(script.syncedUpdate);
  return array.length;
}; */

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
