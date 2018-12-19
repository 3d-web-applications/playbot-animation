/**
 * Decorator to store attributes attached to a specific script.
 * @param {Function} fn Required. Function to be decorated
 * @param {Array} attr Required. Array of attribute names and their description
 * @example
 * const attributes = [];
 * Animator.attributes.add = collectAttributes(Animator.attributes.add, attributes);
 */
const collectAttributes = function (fn, attributes) {
  return function (...args) {
    try {
      const [name, object] = args;
      attributes.push({ name, object });
      return fn.apply(this, args);
    } catch (ex) {
      // console.warning(ex);
      return null;
    }
  };
};

export default collectAttributes;
