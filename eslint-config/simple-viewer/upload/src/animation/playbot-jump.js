const PlaybotJump = pc.createScript('PlaybotJump');

PlaybotJump.attributes.add('_jumpHeight', {
  type: 'number',
  default: 2,
  title: 'Jump Height',
  description: 'Max height after jumping off ground',
});

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

PlaybotJump.prototype.jump = function (entity, normalizedTime) {
  const position = entity.getPosition();
  entity.setPosition(
    position.x,
    this._jumpTransition.value(normalizedTime),
    position.z,
  );
};
