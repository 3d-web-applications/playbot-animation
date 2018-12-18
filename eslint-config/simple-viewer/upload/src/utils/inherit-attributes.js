/**
 * Decorator to store attributes attached to scripts.
 * @param {Function} fn function to be decorated
 * @param {Array} attr array of attribute names and their description
 * @example
 * const attributes = [];
 * Animator.attributes.add = allowInheritance(Animator.attributes.add, attributes);
 */
const allowInheritance = function (fn, attributes) {
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

export default allowInheritance;
