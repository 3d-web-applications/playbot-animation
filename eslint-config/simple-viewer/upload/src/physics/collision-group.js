const CollisionGroup = pc.createScript('CollisionGroup');

CollisionGroup.attributes.add('_entities', {
  type: 'entity',
  array: true,
  title: 'Entities',
  description: 'Entities with rigid body components.',
});

CollisionGroup.attributes.add('_resetDefault', {
  type: 'boolean',
  default: false,
  title: 'Reset Default',
  description: 'If true, entities will loose their default collision group.',
});

for (let index = 1; index <= 8; index += 1) {
  CollisionGroup.attributes.add(`_group${index}`, {
    type: 'boolean',
    default: false,
    title: `Group ${index}`,
    description: 'If true, all entities belong to this group.',
  });
}

// TODO setup function for controller instead of initialize
CollisionGroup.prototype.initialize = function () {
  const {
    _group1, _group2, _group3, _group4, _group5, _group6, _group7, _group8,
    _entities,
  } = this;

  let bitmask = 0;
  if (_group1) bitmask |= pc.BODYGROUP_USER_1;
  if (_group2) bitmask |= pc.BODYGROUP_USER_2;
  if (_group3) bitmask |= pc.BODYGROUP_USER_3;
  if (_group4) bitmask |= pc.BODYGROUP_USER_4;
  if (_group5) bitmask |= pc.BODYGROUP_USER_5;
  if (_group6) bitmask |= pc.BODYGROUP_USER_6;
  if (_group7) bitmask |= pc.BODYGROUP_USER_7;
  if (_group8) bitmask |= pc.BODYGROUP_USER_8;

  _entities.forEach(e => this._updateCollisionGroup(e, bitmask));
};

CollisionGroup.prototype._updateCollisionGroup = function
(targetEntity, bitmask) {
  const { _resetDefault } = this;
  const { rigidbody } = targetEntity;
  if (!rigidbody) {
    return;
  }

  if (_resetDefault) {
    rigidbody.group = pc.BODYGROUP_NONE;
  }

  rigidbody.group |= bitmask;
};
