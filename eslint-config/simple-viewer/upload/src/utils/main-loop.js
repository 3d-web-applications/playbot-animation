import { addToRegistry } from './add-to-registry';
import { registerOnFocusFound } from './on-focus-found';
import { registerOnFocusLost } from './on-focus-lost';

const { prototype } = pc.createScript('MainLoop');

let instance = null;

prototype._subscribers = [
  [], [], [], [], [],
];

prototype.initialize = function () {
  // Allow registration from any instance, but updates only from the first one
  if (instance) {
    this.registerFunction = instance.registerFunction;
    this.enabled = false;
    return;
  }

  instance = this;

  // Primary loop can be paused and resumed
  registerOnFocusFound(() => { this.enabled = true; });
  registerOnFocusLost(() => { this.enabled = false; });
};

prototype.registerFunction = function (fn, stage) {
  addToRegistry(fn, this._subscribers[stage]);
};

prototype.update = function (dt) {
  this._subscribers.forEach(
    array => array.forEach(fn => fn(dt)),
  );
};

export const registerFunction = (fn, stage) => {
  instance.registerFunction(fn, stage);
};
