import { PlayerState } from './player-states';
// import { Transitions } from './player-transitions';

const PlayerController = pc.createScript('PlayerController');

PlayerController.prototype._state = PlayerState.Idle;

Object.defineProperty(PlayerController.prototype, 'state', {
  get() {
    return this._state;
  },
});

/* PlayerController.prototype._isTransitionAllowed = (
  activeState, targetState,
) => {
  const keys = Object.keys(targetState);
  for (let index = 0; index < keys.length; index += 1) {
    const name = keys[index];
    if (activeState[name] === targetState[name]) {
      console.log(name, activeState[name], targetState[name]);
      return false;
    }
  }
  return true;
}; */

PlayerController.prototype.tryToRunForward = function () {
  if (this.state & PlayerState.Forward) return;
  this._state = (this._state & PlayerState.OnGround) | PlayerState.Forward;
  this._onStateChanged();
};

PlayerController.prototype.tryToRunBackward = function () {
  if (this.state & PlayerState.Backward) return;
  this._state = (this._state & PlayerState.OnGround) | PlayerState.Backward;
  this._onStateChanged();
};

PlayerController.prototype.tryToRunLeft = function () {
  if (this.state & PlayerState.Left) return;
  this._state = (this._state & PlayerState.OnGround) | PlayerState.Left;
  this._onStateChanged();
};

PlayerController.prototype.tryToRunRight = function () {
  if (this.state & PlayerState.Right) return;
  this._state = (this._state & PlayerState.OnGround) | PlayerState.Right;
  this._onStateChanged();
};

PlayerController.prototype.tryToJump = function () {
  if (this.state & PlayerState.OnGround) return;
  this._state |= PlayerState.OnGround;
  this._onStateChanged();
};

PlayerController.prototype.tryToIdle = function () {
  if (this.state === PlayerState.Idle) return;
  this._state = PlayerState.Idle;
  this._onStateChanged();
};

PlayerController.prototype._onStateChanged = function () {
  console.log(this.state);
};
