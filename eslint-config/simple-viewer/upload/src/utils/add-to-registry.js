const addToRegistry = (fn, array) => {
  if (typeof fn !== 'function') {
    throw new Error('First argument is not a function');
  }

  if (!Array.isArray(array)) {
    throw new Error('Second argument is not an array');
  }

  array.push(fn);
  return array.length;
};

export { addToRegistry };
