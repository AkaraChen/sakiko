import { expect, test, vi } from 'vitest';
import { lazy } from './lazy';

test('lazy - should compute the value lazily', () => {
    const fn = vi.fn();
    const value = lazy(() => {
        // some heavy computation
        fn();
        return 42;
    });

    expect(fn).not.toHaveBeenCalled();
    const result = value.get();
    expect(fn).toHaveBeenCalled();
    expect(result).toBe(42);
});

test('lazy - should compute the value only once', () => {
    const fn = vi.fn();
    const value = lazy(() => {
        // some heavy computation
        fn();
        return 42;
    });

    const result1 = value.get();
    const result2 = value.get();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result1).toBe(42);
    expect(result2).toBe(42);
});