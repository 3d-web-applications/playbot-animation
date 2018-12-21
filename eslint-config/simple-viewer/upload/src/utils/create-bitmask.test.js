import { createBitmask } from './create-bitmask';

describe(createBitmask, () => {
  it('Create valid bitmask', () => {
    const expected = {
      a: 0, b: 1, c: 2, d: 4, e: 8,
    };

    const actual = createBitmask('a', 'b', 'c', 'd', 'e');

    expect(actual).toEqual(expected);
  });
});
