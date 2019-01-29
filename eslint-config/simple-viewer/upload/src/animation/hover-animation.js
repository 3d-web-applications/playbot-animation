import { inverseLerp } from '../math/inverse-lerp';

const { attributes, prototype } = pc.createScript('HoverAnimation');

attributes.add('_alteration', {
  type: 'curve',
  default: {
    keys: [
      0.00, 0.00,
      0.25, 0.10,
      0.50, 0.00,
      0.75, -0.10,
      1.00, 0.00,
    ],
    type: pc.CURVE_CATMULL,
  },
  title: 'Alteration',
});

attributes.add('_duration', {
  type: 'number',
  title: 'Time',
  default: 1,
});

attributes.add('_factor', {
  type: 'number',
  title: 'Factor',
});

prototype.initialize = function () {
  this._time = 0;
};

prototype.update = function (dt) {
  this._time = (this._time + dt) % this._duration;
  const value = inverseLerp(0, this._duration, this._time);

  const position = this.entity.getLocalPosition();
  position.y += this._alteration.value(value) * this._factor;
  this.entity.setLocalPosition(position);
};
