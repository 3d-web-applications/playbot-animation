const PlaybotKeyboardInput = pc.createScript('PlaybotKeyboardInput');

// PlaybotKeyboardInput.prototype._functionRegister = {};
PlaybotKeyboardInput.prototype._keyDownRegistry = {};
PlaybotKeyboardInput.prototype._keyUpRegistry = {};

PlaybotKeyboardInput.prototype.initialize = function () {
  this.app.keyboard.on(pc.EVENT_KEYDOWN, this._onKeyDown, this);
  this.app.keyboard.on(pc.EVENT_KEYUP, this._onKeyUp, this);
};

/* PlaybotKeyboardInput.prototype._onKeyDown = function (event) {
  const { _functionRegister } = this;
  const keys = Object.keys(_functionRegister);
  keys.forEach((key) => {
    if (event.key.toString() === key) {
      const subscribers = _functionRegister[key];
      subscribers.forEach((func) => {
        func();
      });
    }
  });
} */

/* PlaybotKeyboardInput.prototype.registerFunction = function (key, callback, scope) {
  const func = callback.bind(scope);
  if (this._functionRegister[key]) {
    this._functionRegister[key].push(func);
  } else {
    this._functionRegister[key] = [func];
  }
}; */

PlaybotKeyboardInput.prototype._onKeyDown = function (event) {
  const { _keyDownRegistry } = this;
  const keys = Object.keys(_keyDownRegistry);
  keys.forEach((key) => {
    if (event.key.toString() === key) {
      const subscribers = _keyDownRegistry[key];
      subscribers.forEach((func) => {
        func();
      });
    }
  });
};

PlaybotKeyboardInput.prototype._onKeyUp = function (event) {
  const { registerKeyUp } = this;
  const keys = Object.keys(registerKeyUp);
  keys.forEach((key) => {
    if (event.key.toString() === key) {
      const subscribers = registerKeyUp[key];
      subscribers.forEach((func) => {
        func();
      });
    }
  });
};

PlaybotKeyboardInput.prototype.registerKeyDown = function (key, callback, scope) {
  const func = callback.bind(scope);
  if (this._keyDownRegistry[key]) {
    this._keyDownRegistry[key].push(func);
  } else {
    this._keyDownRegistry[key] = [func];
  }
};

PlaybotKeyboardInput.prototype.registerKeyUp = function (key, callback, scope) {
  const func = callback.bind(scope);
  if (this._keyUpRegistry[key]) {
    this._keyUpRegistry[key].push(func);
  } else {
    this._keyUpRegistry[key] = [func];
  }
};
