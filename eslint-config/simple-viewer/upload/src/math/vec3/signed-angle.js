const { atan2 } = Math;

const temp = new pc.Vec3();

/**
 * Returns the signed angle between two vectors.
 * @param {pc.Vec3} from Current line of sight
 * @param {pc.Vec3} to Direction to target
 * @param {pc.Vec3} axis Vector pointing upwards
 */
export const signedAngle = (from, to, axis) => atan2(
  temp.cross(from, to).dot(axis),
  from.dot(to),
) * pc.math.RAD_TO_DEG;
