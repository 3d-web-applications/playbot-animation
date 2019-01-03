
import { createBitmask } from '../utils/create-bitmask';

const PlayerState = createBitmask(
  'Idle',
  'Forward',
  'Backward',
  'Left',
  'Right',
  'OnGround',
);

export { PlayerState };
