/**
 * Inherit attributes from parent script.
 * @param {Object} script Required. Child script including attributes property.
 * @param {Object} base Required. Parent script including attributes property.
 */
const inheritAttributes = (script, base) => {
  base.attributes.forEach((attribute) => {
    script.attributes.add(attribute.name, attribute.object);
  });
};

/* eslint-disable no-param-reassign */

/**
 * Inherit functions and properties from parent script
 * @param {Object} script Required. Child script including attributes property.
 * @param {Object} base Required. Parent script including attributes property.
 */
const inheritPrototype = function (child, base) {
  child.prototype = Object.create(
    Object.getPrototypeOf(base.prototype),
    Object.getOwnPropertyDescriptors(base.prototype),
  );

  // Make sure functions to set default states are available
  child.prototype.super = base.prototype.initialize || (() => {});
  child.prototype.superPost = base.prototype.postInitialize || (() => {});
};

/* eslint-enable no-param-reassign */

/**
 * Extend a script by an amount of functions, properties and attributes.
 * @param {Object} script Required. Child script including attributes property.
 * @param {Object} base Required. Parent script including attributes property.
 */
const extendScript = (child, parent) => {
  inheritAttributes(child, parent);
  inheritPrototype(child, parent);
};

export { inheritAttributes, inheritPrototype, extendScript };
