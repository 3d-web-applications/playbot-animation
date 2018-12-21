
export const createBitmask = (...args) => {
  const result = { [args[0]]: 0 };
  for (let value = 1, bit = 1; value < args.length; value += 1, bit <<= 1) {
    result[args[value]] = bit;
  }
  return result;
};
