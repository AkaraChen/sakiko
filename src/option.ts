import { __TAG__ } from './symbols'
import { P, match } from 'ts-pattern'

export class Option<T> {
    readonly [__TAG__]: 'Some' | 'None'
    constructor(readonly value: T | null) {
        this[__TAG__] = value === null ? 'None' : 'Some'
    }
    static some<T>(value: T) {
        return new Option(value)
    }
    static none() {
        return new Option(null)
    }
    static from<T>(value: T | null) {
        return new Option(value)
    }
    isSome() {
        return this[__TAG__] === 'Some'
    }
    isNone() {
        return this[__TAG__] === 'None'
    }
    unwrap() {
        if (this.isNone()) {
            throw new Error('Cannot unwrap None.')
        }
        return this.value as T
    }
    unwrapOr(defaultValue: T) {
        return this.isSome() ? (this.value as T) : defaultValue
    }
    unwrapOrElse(fn: () => T) {
        return this.isSome() ? (this.value as T) : fn()
    }
    map<U>(fn: (value: T) => U) {
        return this.isSome()
            ? new Option(fn(this.value as T))
            : new Option(null)
    }
    mapOr<U>(defaultValue: U, fn: (value: T) => U) {
        return this.isSome() ? fn(this.value as T) : defaultValue
    }
    mapOrElse<U>(defaultValue: () => U, fn: (value: T) => U) {
        return this.isSome() ? fn(this.value as T) : defaultValue()
    }
    and<U>(option: Option<U>) {
        return this.isSome() ? option : new Option(null)
    }
    andThen<U>(fn: (value: T) => Option<U>) {
        return this.isSome() ? fn(this.value as T) : new Option(null)
    }
    isSomeAnd(predicate: (value: T) => boolean) {
        return this.isSome() && predicate(this.value as T)
    }
    filter(predicate: (value: T) => boolean) {
        return this.isSomeAnd(predicate) ? this : new Option(null)
    }
    or(option: Option<T>) {
        return this.isSome() ? this : option
    }
    orElse(fn: () => Option<T>) {
        return this.isSome() ? this : fn()
    }
    xor(option: Option<T>) {
        return this.isSome() !== option.isSome() ? this : new Option(null)
    }
    expect(message: string) {
        if (this.isNone()) {
            throw new Error(message)
        }
        return this.value as T
    }

    static match<T>(
        option: Option<T>,
        patterns: {
            Some: (value: T) => any
            None: () => any
        },
    ) {
        return match(option)
            .with({ [__TAG__]: 'Some' }, ({ value }) =>
                patterns.Some(value as T),
            )
            .with({ [__TAG__]: 'None' }, () => patterns.None())
    }
}
