import { createFunctionRegistry } from '../utils/create-function-registry';

const { prototype } = pc.createScript('TimeInterval');

Object.defineProperty(prototype, 'delay', {
  get: () => this._delay,
  set: (value) => {
    if (value <= 0) {
      return;
    }
    this._delay = value;
    this._onDelayChanged();
  },
});

prototype.initialize = function () {
  this._registry = createFunctionRegistry();
  this._intervalId = null;
  this._delay = 1000;
};

prototype.restart = function () {
  this.stop();
  const repeatFn = this._registry.notify;
  this._intervalId = setInterval(repeatFn, this.delay);
};

prototype.stop = function () {
  if (this._intervalId) {
    clearInterval(this._intervalId);
    this._intervalId = null;
  }
};

prototype._onDelayChanged = function () {
  this.restart();
};
