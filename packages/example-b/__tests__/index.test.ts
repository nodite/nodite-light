import b, { a } from '../src';

describe('b', () => {
  it('returns "b"', () => {
    expect(b()).toBe('b');
  });
});

describe('a', () => {
  it('returns "a"', () => {
    expect(a()).toBe('a');
  });
});
