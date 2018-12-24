import { addToRegistry } from './add-to-registry';

const _listeners = [];

window.onblur = (event) => {
  _listeners.forEach((fn) => {
    fn(event);
  });
};

export const registerOnFocusLost = (fn) => {
  addToRegistry(fn, _listeners);
};
