import { Result } from './result'
import { test, expect } from 'vitest'

test('result creation', () => {
    expect(Result.ok(1).isOk()).toBe(true)
    expect(Result.err('error').isErr()).toBe(true)
})

test('result unwrapping', () => {
    expect(Result.ok(1).unwrap()).toBe(1)
    expect(() => Result.err('error').unwrap()).toThrowError('error')
})

test('result and', () => {
    const ok = Result.ok<number, Error>(1)
    const err = Result.err<number, Error>('error')
    expect(ok.and(Result.ok(2)).unwrap()).toBe(2)
    expect(ok.and(Result.err('error')).isErr()).toBe(true)
    expect(err.and(Result.ok(2)).isErr()).toBe(true)
    expect(err.and(Result.err('error2')).isErr()).toBe(true)
})

test('result andThen', () => {
    const ok = Result.ok<number, Error>(1)
    const err = Result.err<number, Error>('error')
    expect(ok.andThen(v => Result.ok(v + 1)).unwrap()).toBe(2)
    expect(ok.andThen(() => Result.err('not ok')).isErr()).toBe(true)
    expect(err.andThen(v => Result.ok(v + 1)).isErr()).toBe(true)
    expect(err.andThen(() => Result.err('error2')).isErr()).toBe(true)
})

test('result mapping', () => {
    expect(
        Result.ok(1)
            .map(v => v + 1)
            .unwrap(),
    ).toBe(2)
    expect(Result.ok(1).mapOr(2, v => v + 1)).toBe(2)
    expect(
        Result.ok(1).mapOrElse(
            () => 3,
            v => v + 1,
        ),
    ).toBe(2)
    expect(() =>
        Result.err('error')
            .mapErr(v => v + '2')
            .unwrap(),
    ).toThrowError('error2')
})
