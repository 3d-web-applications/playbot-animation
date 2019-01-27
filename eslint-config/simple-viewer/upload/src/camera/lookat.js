const { attributes, prototype } = pc.createScript('LookAt');

attributes.add('_targetEntity', {
  type: 'entity',
  title: 'Target',
});

attributes.add('_freezeX', {
  type: 'boolean',
  title: 'Freeze X',
});

attributes.add('_freezeY', {
  type: 'boolean',
  title: 'Freeze Y',
});

attributes.add('_freezeZ', {
  type: 'boolean',
  title: 'Freeze Z',
});

Object.defineProperty(prototype, 'targetEntity', {
  get() {
    return this._targetEntity;
  },

  set(value) {
    this._targetEntity = value;
    this.entity.enabled = value instanceof pc.Entity;
  },
});

prototype.update = function () {
  const position = this.entity.getPosition();
  const targetPosition = this.targetEntity.getPosition();

  if (this._freezeX) targetPosition.x = position.x;
  if (this._freezeY) targetPosition.y = position.y;
  if (this._freezeZ) targetPosition.z = position.z;
  this.entity.lookAt(targetPosition, pc.Vec3.UP);
};
