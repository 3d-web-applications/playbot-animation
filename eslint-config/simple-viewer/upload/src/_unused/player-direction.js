const PlayerDirection = pc.createScript('PlayerDirection');

PlayerDirection.attributes.add('agility', {
  type: 'curve',
  curves: 'xyz',
  default: {
    keys: [
      [0, 5, 1, 0],
      [0, 0, 1, 10],
      [0, 10, 1, 5],
    ],
  },
});

PlayerDirection.prototype._sidewards = 0;
PlayerDirection.prototype._upwards = 0;
PlayerDirection.prototype._forwards = 0;

Object.defineProperty(PlayerDirection.prototype, 'sidewards', {
  get() {
    return this._sidewards;
  },
  set(value) {
    this._sidewards = pc.clamp(value, -1, 1);
  },
});

Object.defineProperty(PlayerDirection.prototype, 'upwards', {
  get() {
    return this._upwards;
  },
  set(value) {
    this._upwards = pc.clamp(value, 0, 1);
  },
});

Object.defineProperty(PlayerDirection.prototype, 'forwards', {
  get() {
    return this._forwards;
  },
  set(value) {
    this._forwards = pc.clamp(value, -1, 1);
  },
});
