import { createPlayerState } from './create-player-state';
import { registerFunction } from '../utils/main-loop';
import { InterpretState } from '../utils/main-loop-stages';

const PlayerController = pc.createScript('PlayerController');

PlayerController.prototype.initialize = function () {
  const state = createPlayerState();

  const input = this.entity.script.PlayerInput;
  input.register(state.setForward.bind(state), 'KEY_UP');
  input.register(state.setBackward.bind(state), 'KEY_DOWN');
  input.register(state.setLeft.bind(state), 'KEY_LEFT');
  input.register(state.setRight.bind(state), 'KEY_RIGHT');
  input.register(state.setJump.bind(state), 'KEY_SPACE');

  this.playerState = state;
};

PlayerController.prototype.postInitialize = function () {
  registerFunction(this.syncedUpdate.bind(this), InterpretState);
};

PlayerController.prototype.syncedUpdate = function () {
  const {
    forward, backward, left, right, jump,
  } = this.playerState;

  // console.log(forward, backward, left, right, jump);

  const propulsion = this.entity.script.PlayerPropulsion;
  if (forward && !backward) {
    propulsion.intensityZ = 1;
  } else if (!forward && backward) {
    propulsion.intensityZ = -1;
  } else {
    propulsion.intensityZ = 0;
  }

  propulsion.intensityY = (jump) ? 1 : 0;

  if (left && !right) {
    propulsion.intensityX = 1;
  } else if (!left && right) {
    propulsion.intensityX = -1;
  } else {
    propulsion.intensityX = 0;
  }
};
