import { addToRegistry } from './add-to-registry';
import { registerOnFocusFound } from './on-focus-found';
import { registerOnFocusLost } from './on-focus-lost';

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
    return;
  }

  MainLoop.instance = this;

  registerOnFocusFound(() => { this.enabled = true; });
  registerOnFocusLost(() => { this.enabled = false; });
};

MainLoop.prototype.addUserInput = function (fn) {
  return addToRegistry(fn, this._userInputs);
};

MainLoop.prototype.addController = function (fn) {
  return addToRegistry(fn, this._controllers);
};

MainLoop.prototype.addAnimator = function (fn) {
  return addToRegistry(fn, this._animators);
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

const addUserInput = script => MainLoop.instance.addUserInput(script);
const addController = script => MainLoop.instance.addController(script);
const addAnimator = script => MainLoop.instance.addAnimator(script);

export {
  addUserInput,
  addController,
  addAnimator,
};
