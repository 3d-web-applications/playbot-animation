import { addToRegistry } from './add-to-registry';
import { registerOnFocusFound } from './on-focus-found';
import { registerOnFocusLost } from './on-focus-lost';

const MainLoop = pc.createScript('MainLoop');

MainLoop.prototype._userInputs = [];
MainLoop.prototype._memory = [];
MainLoop.prototype._controllers = [];
MainLoop.prototype._processors = [];
MainLoop.prototype._animators = [];

MainLoop.instance = null;

MainLoop.prototype.initialize = function () {
  if (MainLoop.instance) {
    // console.error('MainLoop already exist');
    this.addUserInput = MainLoop.instance.addUserInput;
    // this.addStateMemory = MainLoop.instance.addStateMemory;
    this.addController = MainLoop.instance.addController;
    this.addStateProcessor = MainLoop.instance.addStateProcessor;
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

/* MainLoop.prototype.addStateMemory = function (fn) {
  return addToRegistry(fn, this._memory);
}; */

MainLoop.prototype.addController = function (fn) {
  return addToRegistry(fn, this._controllers);
};

MainLoop.prototype.addStateProcessor = function (fn) {
  return addToRegistry(fn, this._processors);
};

MainLoop.prototype.addAnimator = function (fn) {
  return addToRegistry(fn, this._animators);
};

MainLoop.prototype.update = function (dt) {
  this._userInputs.forEach((syncedUpdate) => {
    syncedUpdate(dt);
  });
  /* this._memory.forEach((fn) => {
    fn(dt);
  }); */
  this._controllers.forEach((syncedUpdate) => {
    syncedUpdate(dt);
  });
  this._processors.forEach((fn) => {
    fn(dt);
  });
  this._animators.forEach((syncedUpdate) => {
    syncedUpdate(dt);
  });
};

const addUserInput = script => MainLoop.instance.addUserInput(script);
// const addStateMemory = script => MainLoop.instance.addStateMemory(script); // update source state
const addController = script => MainLoop.instance.addController(script);
const addStateProcessor = script => MainLoop.instance.addStateProcessor(script); // update sink state / end state
const addAnimator = script => MainLoop.instance.addAnimator(script);

export {
  addUserInput,
  // addStateMemory,
  addController,
  addStateProcessor,
  addAnimator,
};
