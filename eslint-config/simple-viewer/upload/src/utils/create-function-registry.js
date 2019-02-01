export const createFunctionRegistry = () => {
  const subscribers = [];

  return {
    registerFunction: (fn) => {
      if (subscribers.indexOf(fn) === -1) {
        subscribers.push(fn);
      }
    },
    unregisterFunction: (fn) => {
      const index = subscribers.indexOf(fn);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    },
    notify: () => {
      subscribers.forEach(fn => fn());
    },
  };
};
