/**
 * @summary Extend a script by an amount of functions, properties and attributes.
 * @param {Object} child - Required. Object which should be extended.
 * @param {Object} parent - Required. The object prototype is used to clone functions and properties.
 * @param {Array} attribute - Optional. Array of attributes which should be displayed in the PlayCanvas editor.
 */
const extend = (child, parent, attributes) => {
  // Without this loop, attributes will still be applied to the child, but they will not show up in the PlayCanvas Editor.
  attributes.forEach((attribute) => {
    child.attributes.add(attribute.name, attribute.object);
  });

  /* eslint no-param-reassign: "error" */
  child.prototype = Object.create(
    Object.getPrototypeOf(parent.prototype),
    Object.getOwnPropertyDescriptors(parent.prototype),
  );

  child.prototype.super = parent.prototype.initialize;
};

export default extend;
