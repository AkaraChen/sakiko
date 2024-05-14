import { __TAG__ } from './symbols'
import { match } from 'ts-pattern'

export class Result<T, E> {
    [__TAG__]: 'Ok' | 'Err'
    constructor(
        readonly value: T,
        readonly error: E,
    ) {
        this[__TAG__] = error === null ? 'Ok' : 'Err'
    }
    static ok<T, E>(value: T) {
        return new Result(value, null as E)
    }
    static err<T, E extends Error>(error: E | string) {
        return new Result(
            null as T,
            error instanceof Error ? error : (new Error(error) as E),
        )
    }
    static from<T, E>(value: T | E, error: E | null) {
        return new Result(value, error)
    }
    unwrap() {
        if (this[__TAG__] === 'Err') {
            throw this.error
        }
        return this.value as T
    }
    isOk() {
        return this[__TAG__] === 'Ok'
    }
    isErr() {
        return this[__TAG__] === 'Err'
    }
    isOkAnd(predicate: (value: T) => boolean) {
        return this.isOk() && predicate(this.value as T)
    }
    isErrAnd(predicate: (error: E) => boolean) {
        return this.isErr() && predicate(this.error as E)
    }
    map<U>(fn: (value: T) => U) {
        return this.isOk()
            ? new Result(fn(this.value as T), null)
            : new Result(null, this.error as E)
    }
    mapOr<U>(defaultValue: U, fn: (value: T) => U) {
        return this.isOk() ? fn(this.value as T) : defaultValue
    }
    mapOrElse<U>(defaultValue: () => U, fn: (value: T) => U) {
        return this.isOk() ? fn(this.value as T) : defaultValue()
    }
    mapErr<F>(fn: (error: E) => F) {
        return this.isErr()
            ? new Result(null, fn(this.error as E))
            : new Result(this.value as T, null)
    }
    inspect(predicate: (value: T) => boolean) {
        return this.isOkAnd(predicate)
            ? this
            : new Result(null, this.error as E)
    }
    inspectErr(predicate: (error: E) => boolean) {
        return this.isErrAnd(predicate)
            ? this
            : new Result(this.value as T, null)
    }
    expect(message: string) {
        if (this.isErr()) {
            throw new Error(message)
        }
        return this.value as T
    }
    unwrapOrDefault(defaultValue: T) {
        return this.isOk() ? (this.value as T) : defaultValue
    }
    expectErr(message: string) {
        if (this.isOk()) {
            throw new Error(message)
        }
        return this.error as E
    }
    unwrapErr() {
        if (this.isOk()) {
            throw new Error('Cannot unwrap Ok.')
        }
        return this.error as E
    }
    and<U>(result: Result<U, E>) {
        return this.isOk() ? result : new Result(null, this.error as E)
    }
    andThen<U>(fn: (value: T) => Result<U, E>) {
        return this.isOk()
            ? fn(this.value as T)
            : new Result(null, this.error as E)
    }
    or<F>(result: Result<T, F>) {
        return this.isOk() ? this : result
    }
    orElse<F>(fn: () => Result<T, F>) {
        return this.isOk() ? this : fn()
    }
    unwrapOr(result: Result<T, E>) {
        return this.isOk() ? (this.value as T) : (result.value as T)
    }
    unwrapOrElse(fn: () => Result<T, E>) {
        return this.isOk() ? (this.value as T) : (fn().value as T)
    }

    static match(
        result: Result<any, any>,
        patterns: {
            Ok: (value: any) => any
            Err: (error: any) => any
        },
    ) {
        return match(result)
            .with({ [__TAG__]: 'Ok' }, () => patterns.Ok(result.value))
            .with({ [__TAG__]: 'Err' }, () => patterns.Err(result.error))
    }
}
