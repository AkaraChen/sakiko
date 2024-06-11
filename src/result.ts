import { toError } from './utils'

/**
 * Represents a result that can either hold a value of type `T` or an error of type `E`.
 *
 * @template T The type of the value.
 * @template E The type of the error.
 */
export class Result<T, E extends Error = Error> {
    readonly error: E | null

    constructor(
        readonly value: T | null,
        error: E | string | null,
    ) {
        this.error = error === null ? error : toError<E>(error)
    }
    /**
     * Creates a new `Result` instance with a successful value.
     *
     * @template T - The type of the successful value.
     * @template E - The type of the error value.
     * @param value - The successful value.
     * @returns A new `Result` instance with the successful value.
     */
    static ok<T, E extends Error = Error>(value: T) {
        return new Result<T, E>(value, null)
    }
    /**
     * Creates a new `Result` instance representing an error.
     *
     * @template T - The type of the value in the `Result`.
     * @template E - The type of the error in the `Result`.
     * @param {E | string} error - The error object or error message.
     * @returns {Result<T, E>} - A new `Result` instance representing an error.
     */
    static err<T, E extends Error = Error>(error: E | string): Result<T, E> {
        return new Result<T, E>(null, toError(error))
    }
    /**
     * Creates a new Result instance from a value and an error.
     * @template T The type of the value.
     * @template E The type of the error.
     * @param {T} value The value of the Result.
     * @param {E | null} error The error of the Result.
     * @returns {Result<T, E>} A new Result instance.
     */
    static from<T, E extends Error = Error>(
        value: T,
        error: E | null,
    ): Result<T, E> {
        return new Result<T, E>(value, error)
    }
    /**
     * Unwraps the value from the Result monad.
     * If the Result contains an error, it throws the error.
     * Otherwise, it returns the value.
     *
     * @returns The unwrapped value.
     * @throws {Error} If the Result contains an error.
     */
    unwrap() {
        if (this.error) {
            throw this.error
        }
        return this.value as T
    }
    /**
     * Checks if the result is considered "ok".
     *
     * @returns {boolean} True if the result is "ok", false otherwise.
     */
    isOk(): boolean {
        return !!this.value && !this.error
    }
    isErr() {
        return !this.value && !!this.error
    }
    /**
     * Checks if the result is Ok and satisfies the given predicate.
     *
     * @param predicate - The predicate function to apply to the value.
     * @returns `true` if the result is Ok and the predicate returns `true`, otherwise `false`.
     */
    isOkAnd(predicate: (value: T) => boolean) {
        return this.isOk() && predicate(this.value as T)
    }
    /**
     * Checks if the result is an error and satisfies the given predicate.
     *
     * @param predicate - The predicate function to apply to the error value.
     * @returns `true` if the result is an error and the predicate returns `true`, otherwise `false`.
     */
    isErrAnd(predicate: (error: E) => boolean) {
        return this.isErr() && predicate(this.error as E)
    }
    /**
     * Applies a function to the value of the `Result` and returns a new `Result` with the transformed value.
     * If the `Result` is an error, it returns a new `Result` with the same error.
     *
     * @template U - The type of the transformed value.
     * @param {function(value: T): U} fn - The function to apply to the value.
     * @returns {Result<U, E>} - A new `Result` with the transformed value or the same error.
     */
    map<U>(fn: (value: T) => U): Result<U, E> {
        return this.isOk()
            ? new Result<U, E>(fn(this.value as T), null)
            : new Result<U, E>(null, this.error)
    }
    /**
     * Maps the value of the `Result` to a new value using the provided function,
     * or returns a default value if the `Result` is an error.
     *
     * @template U - The type of the new value.
     * @param {U} defaultValue - The default value to return if the `Result` is an error.
     * @param {(value: T) => U} fn - The function to map the value of the `Result`.
     * @returns {U} - The mapped value or the default value.
     */
    mapOr<U>(defaultValue: U, fn: (value: T) => U): U {
        return this.isOk() ? fn(this.value as T) : defaultValue
    }
    /**
     * Maps the value of the `Result` to a new value using the provided function,
     * or returns a default value if the `Result` is an `Err`.
     *
     * @template U - The type of the new value.
     * @param {() => U} defaultValue - The function that returns the default value.
     * @param {(value: T) => U} fn - The function to map the value of the `Result`.
     * @returns {U} - The mapped value or the default value.
     */
    mapOrElse<U>(defaultValue: () => U, fn: (value: T) => U): U {
        return this.isOk() ? fn(this.value as T) : defaultValue()
    }
    /**
     * Maps the error value of the Result to a new value using the provided function.
     * If the Result is an Err, a new Result with the mapped error value is returned.
     * If the Result is an Ok, a new Result with the same value and a null error is returned.
     *
     * @template F - The type of the new error value.
     * @param {function(error: E): F} fn - The function to map the error value.
     * @returns {Result<T, F>} - A new Result with the mapped error value.
     */
    mapErr<F extends Error = Error>(fn: (error: E) => F): Result<T, F> {
        return this.isErr()
            ? new Result<T, F>(null, fn(this.error as E))
            : new Result<T, F>(this.value as T, null)
    }
    /**
     * Inspects the value of the Result using the provided predicate function.
     * If the predicate returns true, the current Result is returned.
     * If the predicate returns false, a new Result with the same error is returned.
     *
     * @param predicate - The predicate function to inspect the value.
     * @returns The current Result if the predicate returns true, otherwise a new Result with the same error.
     */
    inspect(predicate: (value: T) => boolean) {
        return this.isOkAnd(predicate) ? this : new Result(null, this.error)
    }
    /**
     * Inspects the error value of the Result and returns a new Result with the same value and error if the provided predicate returns true.
     * If the predicate returns false, a new Result is returned with the same value and a null error.
     *
     * @param predicate A function that takes the error value as a parameter and returns a boolean indicating whether the error should be inspected.
     * @returns A new Result instance with the same value and error if the predicate returns true, otherwise a new Result with the same value and a null error.
     */
    inspectErr(predicate: (error: E) => boolean) {
        return this.isErrAnd(predicate) ? this : new Result(this.value, null)
    }
    /**
     * Throws an error with the specified message if the result is an error.
     * Otherwise, returns the value.
     *
     * @param message - The error message to throw if the result is an error.
     * @returns The value if the result is not an error.
     * @throws Error with the specified message if the result is an error.
     */
    expect(message: string) {
        if (this.isErr()) {
            throw new Error(message)
        }
        return this.value as T
    }
    /**
     * Returns the value contained in the Result if it is Ok, otherwise returns the provided default value.
     *
     * @param defaultValue - The default value to return if the Result is not Ok.
     * @returns The value contained in the Result if it is Ok, otherwise the provided default value.
     */
    unwrapOrDefault(defaultValue: T) {
        return this.isOk() ? (this.value as T) : defaultValue
    }
    /**
     * Throws an error with the specified message if the result is not an error.
     * Returns the error value if the result is an error.
     *
     * @param message - The error message to throw if the result is not an error.
     * @returns The error value if the result is an error.
     * @throws Error with the specified message if the result is not an error.
     */
    expectErr(message: string) {
        if (this.isOk()) {
            throw new Error(message)
        }
        return this.error as E
    }
    /**
     * Unwraps the error value if the result is an error.
     * Throws an error if the result is not an error.
     *
     * @returns The error value.
     * @throws {Error} If the result is not an error.
     */
    unwrapErr() {
        if (this.isOk()) {
            throw new Error('Cannot unwrap Ok.')
        }
        return this.error as E
    }
    /**
     * Combines the current Result with another Result.
     * If the current Result is Ok, returns the other Result.
     * If the current Result is Err, returns a new Result with the same error.
     *
     * @typeparam U The type of the value contained in the other Result.
     * @param result The other Result to combine with.
     * @returns The combined Result.
     */
    and<U>(result: Result<U, E>) {
        return this.isOk() ? result : new Result<U, E>(null, this.error)
    }
    /**
     * Chains a new `Result` by applying a function to the value of the current `Result`.
     * If the current `Result` is an error, the error is propagated to the new `Result`.
     *
     * @template U - The type of the value in the new `Result`.
     * @param {function(value: T): Result<U, E>} fn - The function to apply to the value of the current `Result`.
     * @returns {Result<U, E>} - A new `Result` obtained by applying the function to the value of the current `Result`.
     */
    andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        return this.isOk()
            ? fn(this.value as T)
            : new Result<U, E>(null, this.error as E)
    }
    /**
     * Returns the current result if it is successful (Ok), otherwise returns the provided result.
     * @param result - The result to return if the current result is not successful.
     * @returns The current result if it is successful, otherwise the provided result.
     */
    or<F extends Error = Error>(result: Result<T, F>) {
        return this.isOk() ? this : result
    }
    /**
     * Returns the current `Result` if it is successful (`isOk`), otherwise
     * invokes the provided function `fn` and returns the result of that function.
     *
     * @param fn - A function that returns a `Result` object.
     * @returns The current `Result` if it is successful, otherwise the result of `fn`.
     * @template F - The type of the error value.
     */
    orElse<F extends Error = Error>(fn: () => Result<T, F>) {
        return this.isOk() ? this : fn()
    }
    /**
     * Returns the value contained in the `Result` if it is `Ok`, otherwise returns the value contained in the provided `Result`.
     *
     * @param result - The `Result` to use if the current `Result` is not `Ok`.
     * @returns The value contained in the `Result` if it is `Ok`, otherwise the value contained in the provided `Result`.
     */
    unwrapOr(result: Result<T, E>) {
        return this.isOk() ? (this.value as T) : (result.value as T)
    }
    /**
     * Unwraps the result value if it is `Ok`, otherwise calls the provided function and returns its result.
     *
     * @param fn - The function to call if the result is `Err`.
     * @returns The unwrapped value if the result is `Ok`, otherwise the result of calling the provided function.
     */
    unwrapOrElse(fn: () => Result<T, E>) {
        return this.isOk() ? (this.value as T) : (fn().value as T)
    }

    /**
     * Matches a `Result` object against provided patterns and returns the corresponding result.
     *
     * @template T - The type of the success value in the `Result`.
     * @template E - The type of the error value in the `Result`.
     * @template R - The type of the returned value.
     * @param {Result<T, E>} result - The `Result` object to match against.
     * @param {{ Ok: (value: T) => R, Err: (error: E) => R }} patterns - The patterns to match against.
     * @returns {R} - The result of the matching pattern.
     */
    static match<T, E extends Error, R>(
        result: Result<T, E>,
        patterns: {
            Ok: (value: T) => R
            Err: (error: E) => R
        },
    ): R {
        return result.isOk()
            ? patterns.Ok(result.value as T)
            : patterns.Err(result.error as E)
    }
}
