import { createEntityPool } from '../memory/object-pool';

const { attributes, prototype } = pc.createScript('Spawner');

attributes.add('_prefab', {
  type: 'entity',
  title: 'Prefab',
});

prototype.initialize = function () {
  this.pool = createEntityPool(this._prefab);
  this.index = 0;
};

prototype.update = function () {
  if (this.index > 12) {
    this.enabled = false;
    return;
  }
  const entity = this.pool.acquire();
  const position = entity.getPosition();
  this.index += 1;
  position.x += this.index;
  entity.setPosition(position);
  this.app.root.addChild(entity);
};
