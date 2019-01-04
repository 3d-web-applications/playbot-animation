import { Layers } from './collision-layer-names';

const CollisionMask = pc.createScript('CollisionMask');

CollisionMask.attributes.add('_entities', {
  type: 'entity',
  array: true,
  title: 'Entities',
  description: `Entities with rigid body components. If array stays empty,
    the custom collision mask is applied to the script owner!`,
});

CollisionMask.attributes.add('_useTrigger', {
  type: 'boolean',
  default: true,
  title: 'Use Trigger',
  description: `If true, entities can trigger events on other entities
    having a collision component, but no rigidbody component.`,
});

for (let index = 1; index <= 8; index += 1) {
  CollisionMask.attributes.add(`_mask${index}`, {
    type: 'boolean',
    default: false,
    title: Layers[`BODYGROUP_USER_${index}`],
    description: 'If true, all entities belong to this mask.',
  });
}

// TODO setup function for controller instead of initialize
CollisionMask.prototype.initialize = function () {
  const {
    _mask1, _mask2, _mask3, _mask4, _mask5, _mask6, _mask7, _mask8,
    _entities, _useTrigger,
  } = this;

  let bitmask = 0;
  if (_useTrigger) bitmask |= pc.BODYGROUP_TRIGGER;
  if (_mask1) bitmask |= pc.BODYGROUP_USER_1;
  if (_mask2) bitmask |= pc.BODYGROUP_USER_2;
  if (_mask3) bitmask |= pc.BODYGROUP_USER_3;
  if (_mask4) bitmask |= pc.BODYGROUP_USER_4;
  if (_mask5) bitmask |= pc.BODYGROUP_USER_5;
  if (_mask6) bitmask |= pc.BODYGROUP_USER_6;
  if (_mask7) bitmask |= pc.BODYGROUP_USER_7;
  if (_mask8) bitmask |= pc.BODYGROUP_USER_8;

  if (_entities.lenght) {
    _entities.forEach(e => this._updateCollisionMask(e, bitmask));
  } else {
    this._updateCollisionMask(this.entity, bitmask);
  }
};

CollisionMask.prototype._updateCollisionMask = function
(targetEntity, bitmask) {
  const { rigidbody } = targetEntity;
  if (!rigidbody) {
    return;
  }

  rigidbody.mask = bitmask;
};
