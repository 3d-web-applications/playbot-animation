import { Layers } from './collision-layer-names';

const collisionLayerEnum = [];

Object.entries(Layers).forEach(([key, value]) => {
  collisionLayerEnum.push({ [value]: pc[key] });
});

export { collisionLayerEnum };

/**
 * @example
 * import { collisionLayerEnum } from './collision-layer-enum';
 * // ...
 * MyScript.attributes.add('myVariable', {
 *  type: 'number',
 *  enum: collisionLayerEnum,
 *  default: pc.BODYGROUP_USER_1,
 * });
 */
