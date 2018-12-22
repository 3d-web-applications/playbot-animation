import { remap } from './remap';

describe(remap, () => {
  it('Keep range', () => {
    const value = 5;
    const min1 = 0;
    const max1 = 10;
    const min2 = 0;
    const max2 = 10;
    const expected = 5;

    const actual = remap(value, min1, max1, min2, max2);

    expect(actual).toEqual(expected);
  });
});

describe(remap, () => {
  it('Double range', () => {
    const value = 5;
    const min1 = 0;
    const max1 = 10;
    const min2 = 0;
    const max2 = 20;
    const expected = 10;

    const actual = remap(value, min1, max1, min2, max2);

    expect(actual).toEqual(expected);
  });
});

describe(remap, () => {
  it('Negate range', () => {
    const value = 5;
    const min1 = 0;
    const max1 = 10;
    const min2 = -20;
    const max2 = -10;
    const expected = -15;

    const actual = remap(value, min1, max1, min2, max2);

    expect(actual).toEqual(expected);
  });
});
