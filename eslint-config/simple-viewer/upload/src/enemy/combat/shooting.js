const { attributes, prototype } = pc.createScript('Shooting');

attributes.add('_bulletPrefab', {
  type: 'entity',
  title: 'Bullet Prefab',
});

prototype.initialize = function () {
  const clone = this._bulletPrefab.clone();
  this._bulletPrefab.parent.addChild(clone);
  const position = clone.getPosition();
  position.y = 1;
  clone.setPosition(position);
};
