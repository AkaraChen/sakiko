import { test, expect } from 'vitest'
import { Option } from './option'

test('option creation', () => {
    expect(Option.from(1).isSome()).toBe(true)
    expect(Option.from(null).isNone()).toBe(true)
    expect(Option.some(1).isSome()).toBe(true)
    expect(Option.none().isNone()).toBe(true)
})

test('option unwrapping', () => {
    expect(Option.from(1).unwrap()).toBe(1)
    expect(Option.from<number>(null).unwrapOr(2)).toBe(2)
    expect(Option.from<number>(null).unwrapOrElse(() => 3)).toBe(3)
})

test('option mapping', () => {
    expect(
        Option.from(1)
            .map(v => v + 1)
            .unwrap(),
    ).toBe(2)
    expect(Option.from<number>(null).mapOr(2, v => v + 1)).toBe(2)
    expect(
        Option.from<number>(null).mapOrElse(
            () => 3,
            v => v + 1,
        ),
    ).toBe(3)
})

test('option and', () => {
    expect(Option.from(1).and(Option.from(2)).unwrap()).toBe(2)
    expect(Option.from<number>(null).and(Option.from(2)).isNone()).toBe(true)
    expect(
        Option.from(1)
            .andThen(v => Option.from(v + 1))
            .unwrap(),
    ).toBe(2)
    expect(
        Option.from<number>(null)
            .andThen(v => Option.from(v + 1))
            .isNone(),
    ).toBe(true)
})

test('option filtering', () => {
    expect(
        Option.from(1)
            .filter(v => v > 0)
            .unwrap(),
    ).toBe(1)
    expect(
        Option.from(1)
            .filter(v => v < 0)
            .isNone(),
    ).toBe(true)
})

test('option or', () => {
    expect(Option.from(1).or(Option.from(2)).unwrap()).toBe(1)
    expect(Option.from<number>(null).or(Option.from(2)).unwrap()).toBe(2)
    expect(
        Option.from<number>(null)
            .orElse(() => Option.from(3))
            .unwrap(),
    ).toBe(3)
})

test('option xor', () => {
    expect(Option.from(1).xor(Option.from(2)).isNone()).toBe(true)
})

test('option expect', () => {
    expect(() => Option.from<number>(null).expect('error')).toThrowError(
        'error',
    )
})
