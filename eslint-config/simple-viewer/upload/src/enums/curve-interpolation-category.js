import { curveInterpolationTypes }
  from '../pc.static.properties/curve-interpolation-types';

const curveCategory = [];

curveInterpolationTypes.forEach((propertyName) => {
  curveCategory.push({ [`pc.${propertyName}`]: pc[propertyName] });
});

export { curveCategory };


/**
 * @example
 * import { curveCategory } from '../enums/curve-interpolation-category';
 * // ...
 * MyScript.attributes.add('myVariable', {
 *  type: 'number',
 *  enum: curveCategory,
 *  default: pc.CURVE_LINEAR,
 * });
 */
