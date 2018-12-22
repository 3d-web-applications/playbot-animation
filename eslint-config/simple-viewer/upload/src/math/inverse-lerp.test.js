import { inverseLerp } from './inverse-lerp';

describe(inverseLerp, () => {
  it('Get min', () => {
    const min = 1;
    const max = 2;
    const value = 1;
    const expected = 0;

    const actual = inverseLerp(min, max, value);

    expect(actual).toEqual(expected);
  });
});

describe(inverseLerp, () => {
  it('Get max', () => {
    const min = 1;
    const max = 2;
    const value = 2;
    const expected = 1;

    const actual = inverseLerp(min, max, value);

    expect(actual).toEqual(expected);
  });
});

describe(inverseLerp, () => {
  it('Get 0.5', () => {
    const min = 1;
    const max = 2;
    const value = 1.5;
    const expected = 0.5;

    const actual = inverseLerp(min, max, value);

    expect(actual).toEqual(expected);
  });
});
