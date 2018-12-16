const PlaybotAnimator = pc.createScript('PlaybotAnimator');

PlaybotAnimator.attributes.add('_playbotEntity', {
  type: 'entity',
  title: 'Playbot Entity',
  description: 'Entity with an animation component',
});

PlaybotAnimator.prototype.initialize = function () {
  console.log('Hello World');
};
