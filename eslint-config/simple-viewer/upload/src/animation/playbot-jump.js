const PlaybotJump = pc.createScript('PlaybotJump');

PlaybotJump.attributes.add('_jumpHeight', {
  type: 'number',
  default: 2,
  title: 'Jump Height',
  description: 'Max height after jumping off ground',
});

// PlaybotJump.attributes.add('_duration', {
//   type: 'number',
//   default: 1,
//   title: 'Duration',
//   description: 'Duration until character is landing on plane ground',
// });

PlaybotJump.attributes.add('_jumpTransition', {
  type: 'curve',
  default: {
    keys: [
      0.0, 0.0,
      0.5, 1.0,
      1.0, 0.0,
    ],
  },
  title: 'Jump Transition',
  description: 'Height change over time',
});

// PlaybotJump.prototype._flightTime = 0;

// Object.defineProperty(PlaybotJump.prototype, 'flightTime', {
//   get() {
//     return this._flightTime;
//   },

//   set(value) {
//     if (this._flightTime === value) {
//       return;
//     }
//     this._flightTime = value;
//     this._onTimeChanged();
//   },
// });

// Object.defineProperty(PlaybotJump.prototype, 'isJumping', {
//   get() {
//     return this._flightTime !== 0;
//   },
// });

// PlaybotJump.prototype.initialize = function () {
//   this._playbotAnimator = this.entity.script.PlaybotAnimator;
//   this._playbotAnimator.listener = this;
// };

PlaybotJump.prototype.onTimeChanged = function (normalizedTime) {
  const position = this.entity.getPosition();
  this.entity.setPosition(
    position.x,
    this._jumpTransition.value(normalizedTime),
    position.z,
  );
};

// PlaybotJump.prototype.jump = function (/* entity, normalizedTime */dt) {
//   /* const position = entity.getPosition();
//   entity.setPosition(
//     position.x,
//     this._jumpTransition.value(normalizedTime),
//     position.z,
//   ); */

//   this.flightTime += dt;
// };

// PlaybotJump.prototype._onTimeChanged = function (normalizedTime) {
//   const position = this.entity.getPosition();
//   this.entity.setPosition(
//     position.x,
//     this._jumpTransition.value(this.flightTime),
//     position.z,
//   );
// };
