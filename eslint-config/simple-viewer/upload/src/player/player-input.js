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
  const { _keyboard, _controller, _player } = this;
  const forward = _keyboard.isPressed(pc.KEY_UP);
  const backward = _keyboard.isPressed(pc.KEY_DOWN);
  const left = _keyboard.isPressed(pc.KEY_LEFT);
  const right = _keyboard.isPressed(pc.KEY_RIGHT);
  const jump = _keyboard.isPressed(pc.KEY_SPACE);

  /* _player.tryToJump(jump);
  _player.tryToRunLeft(left && !right);
  _player.tryToRunRight(!left && right);
  _player.tryToRunForward(forward && !backward);
  _player.tryToRunBackward(!forward && backward); */
  // this.forwards += (forward && !backward) ? 0.1 : -0.05;
  // this.backwards += (!forward && backward) ? 0.1 : -0.05;
  // this.left += (left && !right) ? 0.1 : -0.05;
  // this.right += (!left && right) ? 0.1 : -0.05;
  // this.upwards += (jump) ? 0.1 : -0.1;

  // if (forward) this._propulsion.forward();
  // if (jump) this._propulsion.upward();
  // if (left) this._propulsion.sideward();
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

  // _player.tryToIdle();
};
