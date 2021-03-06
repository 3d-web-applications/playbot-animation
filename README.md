# playbot-animation
Contains scripts to blend between animations

## Steps
- Create new PlayCanvas project
- Visit PlayCanvas Store; Search for [Playbot](http://store.playcanvas.com/item/1/playbot); Click on <i>Download</i>; Select your target project

```diff
- Please note that the following sections have no specific order. Currently I am just writing down all my thoughts.
```

## Inheritance

```diff
- Latest tests have shown, that inheriting PlayCanvas enums is still not possible
```

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
A custom main loop should reduce the total amount of 'update' functions, improving the overall performance. Simultaneously a well-designed main loop can also guarantee discrete states at any time. To get this benefit, scripts must be specialized in specific tasks! Please note, that existing scripts which handle multiple tasks can become very hard to integrate. They are easy to implement, but refactoring, testing or replacing those scripts can become complicated. For instance, reading user input and the processing of states should be split up into two or more scripts.

Less update functions mean, that some scripts must call functions from other scripts periodically. So there must be some mechanism to register and unregister functions from the main loop. It is worth to mention, that I am not using the observer pattern here. Scripts do not react instantly when states have been changed. They only react when its is their turn. It also means, that multiple influences can add up, before other scripts handle transformations and animations.
 
The current implementation consists of 5 stages. Scripts can register their public functions for one or more of these stages. Each stage must be completely processed before the next can be started, which 

1. Validate input
2. Inspect states
3. Perform actions
4. Evaluate changes
5. Refresh view

### Notes
- The final amount of necessary stages depends on the problem, which should be solved. In this project, I have started with a single stage. But when I encountered some problems with the jump animation, I have reworked my previous main loop. The main problem was, that I could not detect when my main character would land on uneven floors. Neither the time within the air nor the height above the floor could be used to pick a proper keyframe from the jump animation.

## Code Convention

The PlayCanvas developers have changed their coding conventions in the past. At the beginning scripts were defined like this one:
```javascript
pc.script.create('myScript', function() {
  var MyScript = function (entity) {
    this.entity = entity;
  };
  
  MyScript.prototype = {
    initialize: function () {
      // ...
    },
  return MyScript;
});
```
Now they propose to use something like this
```javascript
var MyScript = pc.createScript('myScript');

MyScript.attributes.add('myAttribute', {
// ...
});

MyScript.prototype.initialize = function () {
  // ...
}
```
I was using the second convention for at least a half of a year, until I have learned, how to upload scripts with webpack. Since then I have improved my own conventions. First of all, let us talk about some rules!
- Even if there are no real private functions in Javascript, use the underscore to mark attributes and functions as private.
- Go on with defining all attributes.
- Afterwards implement getters and setters via Object.defineProperty
- At the end declare all functions. Start with PlayCanvas default functions, e.g. initialize, update, postInitialize, postUpdate

When using esLint, you will see for sure, that you still can improve your code. But be careful. For instance, you will see that some lines will exceed the max line length. Now one could say, why not declaring all functions in one prototype body, like seen below 

```javascript
MyScript.prototype = {
  initialize: function () { // ...
};
```
Because it does not work when hitting the 'Play' button!

Another common mistake is to use arrow functions. Even in prototype bodys. The same errors will occur. That's why you should always avoid using arrow functions when you work with prototypes.
```javascript
MyScript.prototype = {
  initialize: () => { // ...
};
```
Are we doomed to always add the prefix 'MyScript.prototype.' infront of the most functions? The short answer is 'no'. You could declare a constant on top of the function declarations.
```javascript
const attributes = MyScript.attributes;
const prototype = MyScript.prototype;

attributes.add('myAttribute', {
// ...
});

prototype.initialize = function () {
  // ...
}
```
We can go one step further and use the destructuring assigment.
```javascript
const { attributes, prototype } = pc.createScript('MyScript');

attributes.add('myAttribute', {
  // ...
});

prototype.initialize = function () {
  // ...
}
```
The advantage of using the destructuring assignment<sup>1</sup> is to avoid inconsistencies when renaming scripts. Don't get me wrong. Even with the proposed standard convention one has to change the name of a script only in one place<sup>2</sup>. But then the corresponding variable would still keep the old name. See for yourself below.
```javascript
var MyScript = pc.createScript('myRenamedScript');

MyScript.attributes.add('myAttribute', {
// ...
});

MyScript.prototype.initialize = function () {
  // ...
}
```
So, to keep scripts as clean as possible it would be necessary to also rename all occurrences of the main variable. But this can introduce further errors.
### Summary
When following my convention, scripts should look like this one:
```javascript
// 0-N import statements
import { something } from './everything';

const { attributes, prototype } = pc.createScript('MyScript');

// 0-N attribute definitions
attributes.add('myPublicOrPrivateAttribute', { /*...*/ });

// 0-N property definitions
Object.defineProperty(prototype, 'myPublicOrPrivateProperty', {
  get() {
    return this._myPrivateVariable;
  },

  set(value) {
    if (value === this._myPrivateVariable) {
      return;
    }
    this._myPrivateVariable = value;
    this._onMyPrivateVariableChanged();
  },
});

// 0-N variable definitions which are only used inside properties or functions of the current script
prototype._myPrivateVariable = null;

// 0-N standard functions
prototype.initialize = function () { /*...*/ };

// 0-N custom private or public functions
prototype.myFunction = function () { /*...*/ };

// 0-N event handler functions
prototype._onMyPrivateVariableChanged = function () { /*...*/ };
```
You might note, that I list all private variables above the functions, instead of only declaring them inside functions when they are required. I accept the small overhead in return for a better readability. When using JSDoc, it becomess even more important.

There is one more to say to my current conventions. I am currently evaluating strategies, where the objects, used to define the script attributes, were outsourced. This would end up in something similar to header files from C or C++.

### Footnotes
1. Be careful when using the destructuring assignment inside functions from a script. This can also introduce new errors. A common mistake is to pick functions from that script. This will end in losing the binding.
2. After renaming and uploading scripts, don't forget to hit the 'Parse' button in the PlayCanvas Editor!

## Physics
### Linear Damping
When I enabled the physics system in my project, I observed a strange effect. Sometimes characters were falling for a short amount of time. But before they have reached the ground, they were captive in some kind of stasis. The reason was that i had set the linear damping to 1. With any value below 1 this effect is not so obvious. But it can still be observed, for instance by disabling the platform the character is standing at the moment. Consequently the gravity is affected by linear damping, like other forces. But more important is, that the gravity is only applied once after another force was applied to a character. It does not matter if a force was triggered by a script or if another object collides with the character. It makes sense, but unfortunately I was relying on permanent forces. I was hoping to extinguish all forces from the last frame with linear damping, before applying new ones. Otherwise forces would add up over time. This leads me to that point, where I have to review my design for the second time.

What are proper alternatives?
- With a custom physics system, I would be able collect forces, compute result vectors and apply them to characters. It would also allow me to stop/start physics on application pause/continue. But without deep knowledge, I could introduce performance leaks.
- An easier solution is doing some research about proper values for forces and damping. Providing a json file, would enable Game Designers to modify default values even after release. But it will also mean, that I still have to disabled/enabled rigidbodies on application pause/continue manually.
- Another alternative would be to override the linear velocity. But this can result in odd effects as mentioned in this [tutorial](https://developer.playcanvas.com/en/tutorials/Using-forces-on-rigid-bodies/).

![Image shows linear damping](https://github.com/3d-web-applications/playbot-animation/blob/master/resources/linear-damping.png)
![Image shows a character hovering in air](https://github.com/3d-web-applications/playbot-animation/blob/master/resources/gravity.png)

<b>Update No. 1</b><br />
After doing some research, it looks like that all objects in rest, lose their potential energy. I did not find any setup for rigidbodies, where this effect did not happen. As mentioned earlier, objects need another force to be affected by gravity again. Meanwhile there was something else which attract my attention. When setting friction for static and dynamic objects to zero; setting linear damping for dynamic objects to zero and restitution for the static or for the dynamic object to 0.891, the dynamic object will endlessly bounce of the static object without loosing any energy. But when setting the restitution for one of the objects to a higher value, the dynamic object will reach higher points with each bounce.

<b>Update No. 2</b><br />
Like in Unity, the PlayCanvas physics engine assumes that rigidbodies moving slower than a specified minimum speed, come to a halt (see [Unity Manual](https://docs.unity3d.com/Manual/RigidbodiesOverview.html)). Both engines provide methods to [WakeUp()](https://docs.unity3d.com/ScriptReference/Rigidbody.WakeUp.html)/[activate()](https://developer.playcanvas.com/en/api/pc.RigidBodyComponent.html#activate) rigidbodies. But PlayCanvas does not provide a function to put rigidbodies back to sleep. Maybe one can set the linearFactor and the linearVelocity properties of the rigidbody component to (0, 0, 0). I did not test this yet. One could also change the type of the rigidbody to pc.BODYTYPE_STATIC and later back to pc.BODYTYPE_DYNAMIC or pc.BODYTYPE_KINEMATIC. But like in Unity, this will introduce performance overheads. That is why this strategy should be used sparingly.

To test the behaviour of the PlayCanvas physics engine by yourself, you can attach the script below to an entity with a static rigidbody component. Place another entity with a dynamic rigidbody component on top of the other. Furthermore add model and collision components to both. Now launch the application and allow the second entity to rest on top of the first one. Then disable the static rigidbody component and watch what happens. After a short amount of time, you will see the entity with the dynamic rigidbody component falling through the first one. Other ways to achieve this effect is by disabling the first entity or changing its position within the PlayCanvas editor.
```javascript
var Wakeup = pc.createScript('Wakeup');

Wakeup.prototype.initialize = function() {
    this.entity.collision.on('collisionend', this._onCollisionEnd, this);
};

Wakeup.prototype._onCollisionEnd = function(otherEntity) {
    otherEntity.rigidbody.activate();
};
```

## Asset Import Problem

After modelling two types of batteries, I discovered a problem inside PlayCanvas. It cannot handle negative scales properly. Sometimes this can be in handy to mirror the model in x, y or z. Supposedly, Unity and ThreeJS have some correction methods. But as seen in the image, PlayCanvas does not have such feature yet. The naive solution is to select all corresponding materials and change backface culling to frontface culling. Another naive solution would be to flip the normals inside your prefered 3d modelling tool. But this can introduce further problems like missing reflections. So both ways are not applicable when developing software for customers. The only serious solution seems to be to double-check all models twice during the export. In my case, I did not saw, that a negative scale was set while I was applying Modifiers in Blender.

![Three models placed in the scene. One shows some culling problems](https://github.com/3d-web-applications/playbot-animation/blob/master/resources/batteries.png)

## LookAt Problem

PlayCanvas provides a lookAt function like other engines. But in contrast to others, this function [reorients the graph node so that the negative z-axis points towards the target](https://developer.playcanvas.com/en/api/pc.Entity.html#lookAt). So the entity using that function is not rotated towards the target. Instead it faces into the opposite direction. The images below shall help to visualize the problem. As you can see in the first image, the hover tank on the right is selected. The handles show that the model is rotated towards the positive z-axis. The script calling the lookAt function (marked with an X inside the hierarchy) is attached to <i>Tank_gun_turret</i> entity. As you can see in the second image, the turret of that hover tank is looking in the opposite direction.  You could solve the problem by adding another rotation inside the script. But this would also mean adding an additional calculation per function call. A much better approach is to rotate the model inside the editor before launching the application. For instance, the second hover tank was rotated by 180 degrees around the y-axis in the editor. But as you can see in the second image, the turret is still not facing the target. The 180 degrees of the turret get lost when the turret entity is calling the lookAt function. The solution to this problem is to place the models under another entity. This new entity should call the lookAt function, while its children can be rotated by 180 degrees.  
![Shows a scene inside the PlayCanvas editor](https://github.com/3d-web-applications/playbot-animation/blob/master/resources/lookat-example-1.png)
![Shows the same scene after the application was launched](https://github.com/3d-web-applications/playbot-animation/blob/master/resources/lookat-example-2.png)

### Thoughts about number accuracy
Before I found a better solution to compute the angle between two vectors, I was translating and analyzing the Angle and SignedAngle functions from [Unity](https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Vector3.cs). My first results have shown that angles near 0 as well as angles near 180 degrees could not be computed very well. 

## Open Tasks
- Leaving footprints
- Walking on ice or blading on ice (pause walk animation at N seconds)
- Falling down on ice (forward movement + die animation)
- Colliding with enemies
- Enemies chasing player
- Enemies flee from player
- Swarm system in 2D/3D
- Custom tag system
- UI via React components

