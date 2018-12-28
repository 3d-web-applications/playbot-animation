import { addUserInput } from '../utils/main-loop';

const PlayerInput = pc.createScript('PlayerInput');

PlayerInput.prototype._controller = null;

PlayerInput.prototype.initialize = function () {
  this._keyboard = new pc.Keyboard(window);
  this._player = this.entity.script.PlayerController;
  this._propulsion = this.entity.script.PlayerPropulsion;
};

PlayerInput.prototype.postInitialize = function () {
  addUserInput(this.syncedUpdate.bind(this));
};

// PlayerInput.prototype.update = function (dt)
PlayerInput.prototype.syncedUpdate = function (/* dt */) {
  // Important note: this.app.keyboard.on(pc.EVENT_KEYDOWN, ..., this) would work, but its not smooth enough
  const { _keyboard } = this;
  const forward = _keyboard.isPressed(pc.KEY_UP);
  const backward = _keyboard.isPressed(pc.KEY_DOWN);
  const left = _keyboard.isPressed(pc.KEY_LEFT);
  const right = _keyboard.isPressed(pc.KEY_RIGHT);
  const jump = _keyboard.isPressed(pc.KEY_SPACE);

  if (forward && !backward) {
    this._propulsion.intensityZ = 1;
  } else if (!forward && backward) {
    this._propulsion.intensityZ = -1;
  } else {
    this._propulsion.intensityZ = 0;
  }

  this._propulsion.intensityY = (jump) ? 1 : 0;

  if (left && !right) {
    this._propulsion.intensityX = 1;
  } else if (!left && right) {
    this._propulsion.intensityX = -1;
  } else {
    this._propulsion.intensityX = 0;
  }
};
