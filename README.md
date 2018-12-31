# playbot-animation
Contains scripts to blend between animations

## Steps
- Create new PlayCanvas project
- Visit PlayCanvas Store; Search for [Playbot](http://store.playcanvas.com/item/1/playbot); Click on <i>Download</i>; Select your target project

## Inheritance

People comming from object-oriented programming would often like to have some kind of object inheritance in Javascript (JS). It is possible in JS, but not gladly seen by other developers. But in PlayCanvas, there is a specific need for such feature. Reducing the amount of code inside PlayCanvas scripts sustain readability and refactorability. Probably, people coming from Unity, enjoying the comfort of inheriting scripts with serialized properties, have the biggest need for such feature. Well, that was my primary reason to develop such a feature.

Please also note:
- it is not widely tested yet
- it produces some overhead
- there might be better alternatives
- for better understanding, the example below was simplified. It does not show neither the chosen webpack configuration nor the import of functions.

<b>Step 1:</b> Add both function to your project
The first function is for getting all attributes (~serialized fields in Unity) from the parent class.
The second one is for extending the child script.
```javascript
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

const extendScript = (child, parent, attributes) => {
  // Without this loop, attributes will still be applied to the child, but they will not show up in the PlayCanvas Editor.
  if (Array.isArray(attributes)) {
    attributes.forEach((attribute) => {
      child.attributes.add(attribute.name, attribute.object);
    });
  }

  /* eslint no-param-reassign: "error" */
  child.prototype = Object.create(
    Object.getPrototypeOf(parent.prototype),
    Object.getOwnPropertyDescriptors(parent.prototype),
  );

  // Make sure functions to set default states are available
  child.prototype.super = parent.prototype.initialize || (() => {});
  child.prototype.superPost = parent.prototype.postInitialize || (() => {});
};
```

<b>Step 2:</b> Prepare the parent script
Add the first function at the beginning of the parent script to get all attributes. And use export the script and the collected attributes at the end of your file.
```javascript
const Animator = pc.createScript('Animator');

const attributes = [];
Animator.attributes.add = collectAttributes(
  Animator.attributes.add,
  attributes,
);

// example attribute
Animator.attributes.add('_animationSpeed', {
  type: 'number',
  title: 'Start Animation Speed',
  default: 1,
  description: 'Set default animation speed',
});

// (...)

export { Animator, attributes };
```

<b>Step 3:</b> Prepare the child script
Call the second function at the beginning of your child script. It enables you to overwrite functions. Please also note, that you have to call the initialize and postInitialize functions of your parent explicitly to prevent errors!
```javascript
const PlaybotAnimator = pc.createScript('PlaybotAnimator');
extendScript(PlaybotAnimator, Animator, attributes);

PlaybotAnimator.prototype.initialize = function () {
  // optional
  this.super();
};
```

<b>Step 4:</b> Have fun :-)

## Main Loop
I am currently working on a main loop with 5 stages.
- Visit input
- Interpret state
- Perform action
- Evaluate change
- Refresh screeen
