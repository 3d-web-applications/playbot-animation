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

```javascript
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
