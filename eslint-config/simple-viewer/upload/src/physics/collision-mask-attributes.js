import { Layers } from './data/collision-layer-names';

const Entities = {
  type: 'entity',
  array: true,
  title: 'Entities',
  description: `Entities with rigid body components. If array stays empty,
    the custom collision mask is applied to the script owner!`,
};

const UseTrigger = {
  type: 'boolean',
  default: true,
  title: 'Use Trigger',
  description: `If true, entities can trigger events on other entities
    having a collision component, but no rigidbody component.`,
};

const MakeMask = index => ({
  type: 'boolean',
  default: false,
  title: Layers[`BODYGROUP_USER_${index}`],
  description: 'If true, all entities belong to this mask.',
});

export { Entities, UseTrigger, MakeMask };
