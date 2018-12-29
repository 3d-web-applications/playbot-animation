import { addToRegistry } from './add-to-registry';
import { registerOnFocusFound } from './on-focus-found';
import { registerOnFocusLost } from './on-focus-lost';

const MainLoop = pc.createScript('MainLoop');

MainLoop.prototype._subscribers = [
  [], [], [], [], [],
];

MainLoop.instance = null;

MainLoop.prototype.initialize = function () {
  // Allow registration from any instance, but updates only from the first one
  if (MainLoop.instance) {
    this.registerFunction = MainLoop.instance.registerFunction;
    this.enabled = false;
    return;
  }

  MainLoop.instance = this;

  // Primary loop can be paused and resumed
  registerOnFocusFound(() => { this.enabled = true; });
  registerOnFocusLost(() => { this.enabled = false; });
};

MainLoop.prototype.registerFunction = function (fn, stage) {
  addToRegistry(fn, this._subscribers[stage]);
};

MainLoop.prototype.update = function (dt) {
  this._subscribers.forEach(
    array => array.forEach(fn => fn(dt)),
  );
};

export const registerFunction = (fn, stage) => {
  MainLoop.instance.registerFunction(fn, stage);
};
