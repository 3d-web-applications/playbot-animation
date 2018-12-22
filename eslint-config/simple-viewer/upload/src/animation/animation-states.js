
import { createBitmask } from '../utils/create-bitmask';

const Forward = true;
const Backward = !Forward;

export { Forward, Backward };

const {
  Idle, Run, Jump, Die,
} = createBitmask('Idle', 'Run', 'Jump', 'Die');

const RunAndJump = Run | Jump;

export {
  Idle, Run, Jump, Die, RunAndJump,
};
