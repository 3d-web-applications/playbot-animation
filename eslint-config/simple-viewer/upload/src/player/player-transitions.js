export const Transitions = {
  Forward: [
    { Backward: true },
  ],
  Backward: [
    { Forward: true },
  ],
  Left: [
    { Jump: true },
    { Right: true },
  ],
  Right: [
    { Jump: true },
    { Left: true },
  ],
  Jump: [],
  idle: [
    { Jump: true },
  ],
};
