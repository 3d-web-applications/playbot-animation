import { createEntityPool } from './object-pool';

const stub = { clone: () => this };

test('createEntityPool must be a function', () => {
  expect(typeof createEntityPool).toBe('function');
});

test('new pools must be empty', () => {
  const expected = 0;
  const pool = createEntityPool(null);
  const actual = pool.size();
  expect(actual).toBe(expected);
});

test('expand - increase pool size by 10', () => {
  const expected = 10;
  const pool = createEntityPool(stub);
  pool.expand(expected);
  const actual = pool.size();
  expect(actual).toBe(expected);
});

test('release - increase pool size by 1', () => {
  const expected = 1;
  const pool = createEntityPool(stub);
  pool.release(stub);
  const actual = pool.size();
  expect(actual).toBe(expected);
});

test('acquire - decrease pool size by 1 when pool is not empty', () => {
  const expected = 0;
  const pool = createEntityPool(stub);
  pool.expand(expected + 1);
  pool.acquire();
  const actual = pool.size();
  expect(actual).toBe(expected);
});

test('acquire - decrease pool size by 9 when pool is empty', () => {
  const expected = 9;
  const pool = createEntityPool(stub);
  pool.acquire();
  const actual = pool.size();
  expect(actual).toBe(expected);
});
