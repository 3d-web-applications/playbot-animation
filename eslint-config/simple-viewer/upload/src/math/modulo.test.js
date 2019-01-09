import { modulo } from './modulo';

describe(modulo, () => {
  it('Find remainder for positive dividend and divisor', () => {
    const expected = 2;
    const actual = modulo(12, 5);

    expect(actual).toEqual(expected);
  });

  it('Find remainder for negative dividend and positive divisor', () => {
    const expected = 3;
    const actual = modulo(-12, 5);

    expect(actual).toEqual(expected);
  });

  it('Find remainder for positive dividend and negative divisor', () => {
    const expected = -3;
    const actual = modulo(12, -5);

    expect(actual).toEqual(expected);
  });

  it('Find remainder for negative dividend and divisor', () => {
    const expected = -2;
    const actual = modulo(-12, -5);

    expect(actual).toEqual(expected);
  });

  it('Return 0 when dividend is 0', () => {
    const expected = 0;
    const actual = modulo(0, 5);

    expect(actual).toEqual(expected);
  });

  it('Return NaN when divisor is 0', () => {
    const expected = NaN;
    const actual = modulo(12, 0);

    expect(actual).toEqual(expected);
  });

  it('Return NaN when dividend and divisor are 0', () => {
    const expected = NaN;
    const actual = modulo(0, 0);

    expect(actual).toEqual(expected);
  });
});
