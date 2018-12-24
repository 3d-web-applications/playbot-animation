import { addToRegistry } from './add-to-registry';

const _listeners = [];

window.onfocus = (event) => {
  _listeners.forEach((fn) => {
    fn(event);
  });
};

export const registerOnFocusFound = (fn) => {
  addToRegistry(fn, _listeners);
};
