import { signedAngle } from '../math/vec3/signed-angle';

const { attributes, prototype } = pc.createScript('AngularDistance');

attributes.add('_targetEntity', {
  type: 'entity',
  title: 'Target',
});

prototype.update = function () {
  const position = this.entity.getPosition();
  const targetPosition = this._targetEntity.getPosition();

  console.log(signedAngle(this.entity.forward, targetPosition.sub(position), pc.Vec3.UP));
};
