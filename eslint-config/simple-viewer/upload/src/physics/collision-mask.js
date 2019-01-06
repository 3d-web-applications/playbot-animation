import { Entities, UseTrigger, MakeMask } from './collision-mask-attributes';

const { attributes, prototype } = pc.createScript('CollisionMask');

attributes.add('_entities', Entities);
attributes.add('_useTrigger', UseTrigger);
attributes.add('_mask1', MakeMask(1));
attributes.add('_mask2', MakeMask(2));
attributes.add('_mask3', MakeMask(3));
attributes.add('_mask4', MakeMask(4));
attributes.add('_mask5', MakeMask(5));
attributes.add('_mask6', MakeMask(6));
attributes.add('_mask7', MakeMask(7));
attributes.add('_mask8', MakeMask(8));

prototype.initialize = function () {
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

  if (_entities.length) {
    _entities.forEach(e => this._updateCollisionMask(e, bitmask));
  } else {
    this._updateCollisionMask(this.entity, bitmask);
  }
};

prototype._updateCollisionMask = function
(targetEntity, bitmask) {
  const { rigidbody } = targetEntity;
  if (!rigidbody) {
    return;
  }

  rigidbody.mask = bitmask;
};
