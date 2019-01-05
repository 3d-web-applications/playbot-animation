import { Layers } from './data/collision-layer-names';

const Entities = {
  type: 'entity',
  array: true,
  title: 'Entities',
  description: `Entities with rigid body components. If array stays empty,
    the custom collision group is applied to the script owner!`,
};

const ResetDefault = {
  type: 'boolean',
  default: false,
  title: 'Reset Default',
  description: 'If true, entities will loose their default collision group.',
};

const MakeGroup = index => ({
  type: 'boolean',
  default: false,
  title: Layers[`BODYGROUP_USER_${index}`],
  description: 'If true, all entities belong to this group.',
});


export { Entities, ResetDefault, MakeGroup };
