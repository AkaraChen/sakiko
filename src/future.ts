import { toError } from './utils'

type PromiseComposer<T> = () => Promise<T>

/**
 * Represents a Future, which is a subclass of Promise.
 * @template T The type of the resolved value.
 * @template E The type of the rejected error.
 */
export class Future<T, E extends Error = Error> extends Promise<T> {
    protected state: 'Pending' | 'Fulfilled' | 'Rejected'

    /**
     * Creates a new Future instance.
     * @param executor A function that is called immediately with the resolve and reject functions.
     */
    constructor(
        executor: (
            resolve: (value: T) => void,
            reject: (error: E) => void,
        ) => void,
    ) {
        let resolve: (value: T) => void
        let reject: (error: E) => void
        super((res, rej) => {
            resolve = res
            reject = rej
        })
        this.state = 'Pending'
        executor(
            value => {
                this.state = 'Fulfilled'
                resolve(value)
            },
            error => {
                this.state = 'Rejected'
                reject(error)
            },
        )
    }

    /**
     * Creates a Future that resolves with the given value.
     * @param value The value to resolve with.
     * @returns A new Future instance.
     */
    static ok<T, E extends Error = Error>(value: T) {
        return Future.from<T, E>(Promise.resolve(value))
    }

    /**
     * Creates a Future that rejects with the given error.
     * @param error The error to reject with.
     * @returns A new Future instance.
     */
    static err<T, E extends Error = Error>(error: E | string) {
        return Future.from<T, E>(Promise.reject(toError(error)))
    }

    /**
     * Creates a Future from an existing Promise.
     * @param promise The Promise to create the Future from.
     * @returns A new Future instance.
     */
    static from<T, E extends Error = Error>(
        promise: Promise<T> | PromiseComposer<T>,
    ) {
        const value = promise instanceof Promise ? promise : promise()
        return new Future<T, E>((resolve, reject) => {
            value.then(resolve).catch(reject)
        })
    }

    /**
     * Checks if the Future is in the pending state.
     * @returns True if the Future is pending, false otherwise.
     */
    isPending() {
        return this.state === 'Pending'
    }

    /**
     * Checks if the Future is in the fulfilled state.
     * @returns True if the Future is fulfilled, false otherwise.
     */
    isFulfilled() {
        return this.state === 'Fulfilled'
    }

    /**
     * Checks if the Future is in the rejected state.
     * @returns True if the Future is rejected, false otherwise.
     */
    isRejected() {
        return this.state === 'Rejected'
    }
}
