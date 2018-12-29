const PlayerState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  setForward(value) { this.forward = value; },
  setBackward(value) { this.backward = value; },
  setLeft(value) { this.left = value; },
  setRight(value) { this.right = value; },
  setJump(value) { this.jump = value; },
};

export const createPlayerState = () => Object.create(PlayerState);
