import { Result } from './result'

const NOT_COMPUTED = Symbol('not computed')

interface ILazy<T> {
    get(): T
}

export class Lazy<T> implements ILazy<T> {
    value: T | typeof NOT_COMPUTED = NOT_COMPUTED
    constructor(private readonly fn: () => T) {}

    get(): T {
        if (this.value === NOT_COMPUTED) {
            this.value = this.fn()
        }
        return this.value as T
    }

    result<E extends Error>(): Result<T, E> {
        try {
            return Result.ok(this.get())
        } catch (error) {
            return Result.err(error as E)
        }
    }
}

export function lazy<T>(fn: () => T): ILazy<T> {
    return new Lazy(fn)
}
