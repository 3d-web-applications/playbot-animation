/**
 * Find the remainder after division of one number by another.
 * @param {Number} a Dividend
 * @param {Number} n Divisor
 */
export const modulo = (a, n) => (((a % n) + n) % n);
