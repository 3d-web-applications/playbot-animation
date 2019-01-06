import { Entities, ResetDefault, MakeGroup }
  from './collision-group-attributes';

const { attributes, prototype } = pc.createScript('CollisionGroup');

attributes.add('_entities', Entities);
attributes.add('_resetDefault', ResetDefault);
attributes.add('_group1', MakeGroup(1));
attributes.add('_group2', MakeGroup(2));
attributes.add('_group3', MakeGroup(3));
attributes.add('_group4', MakeGroup(4));
attributes.add('_group5', MakeGroup(5));
attributes.add('_group6', MakeGroup(6));
attributes.add('_group7', MakeGroup(7));
attributes.add('_group8', MakeGroup(8));

prototype.initialize = function () {
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

  if (_entities.length) {
    _entities.forEach(e => this._updateCollisionGroup(e, bitmask));
  } else {
    this._updateCollisionGroup(this.entity, bitmask);
  }
};

prototype._updateCollisionGroup = function (targetEntity, bitmask) {
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
