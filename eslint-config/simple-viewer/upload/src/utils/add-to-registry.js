export const addToRegistry = (fn, array) => {
  if (!fn || typeof fn !== 'function') {
    return -1;
  }

  array.push(fn);
  return array.length;
};
