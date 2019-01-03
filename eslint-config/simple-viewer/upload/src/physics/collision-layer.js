const CollisionLayer = pc.createScript('CollisionLayer');

// see also https://github.com/playcanvas/engine/blob/master/src/framework/components/rigid-body/constants.js

CollisionLayer.attributes.add('_dynamicEntity', {
  type: 'entity',
  title: 'Dynamic Entity',
  description: 'Entity with a collision component and a rigid body component. The latter type must be set to dynamic!',
});

for (let index = 1; index <= 8; index += 1) {
  CollisionLayer.attributes.add(`_group${index}`, {
    type: 'boolean',
    default: false,
    title: `pc.BODYGROUP_USER_${index}`,
  });
}

// TODO setup function for controller instead of initialize
CollisionLayer.prototype.initialize = function () {
  const { rigidbody } = this._dynamicEntity;

  rigidbody.group = pc.BODYGROUP_NONE;

  for (let index = 1; index <= 8; index += 1) {
    if (this[`_group${index}`]) rigidbody.group = pc[`BODYGROUP_USER_${index}`];
  }

  // rigidbody.mask = pc.BODYMASK_NONE;
};
