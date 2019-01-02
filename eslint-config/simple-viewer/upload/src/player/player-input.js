import { registerFunction } from '../utils/main-loop';
import { ValidateInput } from '../utils/main-loop-stages';
import { addToRegistry } from '../utils/add-to-registry';

const PlayerInput = pc.createScript('PlayerInput');

PlayerInput.prototype._listeners = {};

PlayerInput.prototype.register = function (fn, keycodeName) {
  if (!this._listeners[keycodeName]) {
    this._listeners[keycodeName] = [];
  }

  addToRegistry(fn, this._listeners[keycodeName]);
};

PlayerInput.prototype.initialize = function () {
  this._keyboard = new pc.Keyboard(window);
  this._player = this.entity.script.PlayerController;
  this._propulsion = this.entity.script.PlayerPropulsion;
};

PlayerInput.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), ValidateInput);
};

// Important note: instead of calling isPressed(...), one could also use this.app.keyboard.on(pc.EVENT_KEYDOWN, ..., this), but this is not smooth enough

// PlayerInput.prototype.update = function (dt)
PlayerInput.prototype.syncedUpdate = function (/* dt */) {
  const { _keyboard, _listeners } = this;
  const keys = Object.keys(_listeners);
  keys.forEach((keycodeName) => {
    const keyPressed = _keyboard.isPressed(pc[keycodeName]);
    const group = _listeners[keycodeName];
    for (let index = 0; index < group.length; index += 1) {
      group[index](keyPressed);
    }
  });
};
