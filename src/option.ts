/**
 * Represents an optional value that may or may not exist.
 * @template T The type of the value.
 */
export class Option<T> {
    constructor(readonly value: T | null) {}
    /**
     * Creates an Option instance with a non-null value.
     *
     * @template T - The type of the value.
     * @param value - The value to be wrapped in an Option.
     * @returns An Option instance containing the provided value.
     */
    static some<T>(value: T) {
        return new Option(value)
    }
    /**
     * Represents an empty `Option`.
     * @returns An empty `Option`.
     * @typeparam T The type of the value.
     */
    static none<T>(): Option<T> {
        return new Option<T>(null)
    }
    /**
     * Creates an Option instance from a value.
     * @param value - The value to create an Option from.
     * @returns An Option instance.
     * @template T - The type of the value.
     */
    static from<T>(value: T | null) {
        return new Option(value)
    }
    /**
     * Checks if the Option is in a "Some" state.
     * @returns {boolean} True if the Option is in a "Some" state, false otherwise.
     */
    isSome(): boolean {
        return this.value !== null
    }
    /**
     * Checks if the Option is None.
     * @returns {boolean} True if the Option is None, false otherwise.
     */
    isNone(): boolean {
        return this.value === null
    }
    /**
     * Checks if a value is an instance of the Option class.
     *
     * @param value - The value to check.
     * @returns `true` if the value is an instance of Option, `false` otherwise.
     */
    static isOption(value: any) {
        return value instanceof Option
    }
    /**
     * Unwraps the value contained in the Option.
     *
     * @throws {Error} if the Option is None.
     * @returns {T} The unwrapped value.
     */
    unwrap(): T {
        if (this.isNone()) {
            throw new Error('Cannot unwrap None.')
        }
        return this.value as T
    }
    /**
     * Returns the wrapped value if it exists, otherwise returns the provided default value.
     *
     * @param defaultValue - The default value to return if the option is `None`.
     * @returns The wrapped value if it exists, otherwise the default value.
     */
    unwrapOr(defaultValue: T) {
        return this.isSome() ? (this.value as T) : defaultValue
    }
    /**
     * Returns the wrapped value if it is `Some`, otherwise invokes the provided function `fn` and returns its result.
     *
     * @param fn - The function to be invoked when the wrapped value is `None`.
     * @returns The wrapped value if it is `Some`, otherwise the result of invoking the provided function `fn`.
     * @template T - The type of the wrapped value.
     */
    unwrapOrElse(fn: () => T) {
        return this.isSome() ? (this.value as T) : fn()
    }
    /**
     * Applies a function to the value of the Option if it is Some, and returns a new Option with the result.
     * If the Option is None, returns a new Option with a null value.
     *
     * @template U - The type of the value returned by the mapping function.
     * @param {function} fn - The mapping function to apply to the value.
     * @returns {Option<U>} - A new Option with the mapped value.
     */
    map<U>(fn: (value: T) => U): Option<U> {
        return this.isSome()
            ? new Option<U>(fn(this.value as T))
            : new Option<U>(null)
    }
    /**
     * Maps the value of the Option to a new value using the provided function,
     * or returns a default value if the Option is None.
     *
     * @template U - The type of the new value.
     * @param {U} defaultValue - The default value to return if the Option is None.
     * @param {(value: T) => U} fn - The function to apply to the value of the Option.
     * @returns {U} - The mapped value or the default value.
     */
    mapOr<U>(defaultValue: U, fn: (value: T) => U): U {
        return this.isSome() ? fn(this.value as T) : defaultValue
    }
    /**
     * Maps the value of the Option to a new value using the provided function,
     * or returns a default value if the Option is None.
     *
     * @template U - The type of the new value.
     * @param {() => U} defaultValue - A function that returns the default value.
     * @param {(value: T) => U} fn - A function that maps the value of the Option to a new value.
     * @returns {U} - The mapped value or the default value.
     */
    mapOrElse<U>(defaultValue: () => U, fn: (value: T) => U): U {
        return this.isSome() ? fn(this.value as T) : defaultValue()
    }
    /**
     * Returns the `option` if the current option is `Some`, otherwise returns a new `Option` with `null` value.
     *
     * @template U - The type of the value contained in the `option` parameter.
     * @param {Option<U>} option - The option to be returned if the current option is `Some`.
     * @returns {Option<U>} - The `option` if the current option is `Some`, otherwise a new `Option` with `null` value.
     */
    and<U>(option: Option<U>): Option<U> {
        return this.isSome() ? option : new Option<U>(null)
    }
    /**
     * Applies the given function to the value contained in the `Option` if it is `Some`.
     * If the `Option` is `None`, it returns a new `Option` with a `null` value.
     *
     * @param fn - The function to apply to the value.
     * @returns An `Option` that contains the result of applying the function, or a new `Option` with a `null` value.
     */
    andThen<U>(fn: (value: T) => Option<U>) {
        return this.isSome() ? fn(this.value as T) : new Option(null)
    }
    /**
     * Checks if the Option is Some and satisfies the given predicate.
     *
     * @param predicate - The predicate function to test the value with.
     * @returns `true` if the Option is Some and the value satisfies the predicate, `false` otherwise.
     */
    isSomeAnd(predicate: (value: T) => boolean) {
        return this.isSome() && predicate(this.value as T)
    }
    /**
     * Filters the option based on the given predicate function.
     * If the predicate returns true for the option's value, returns the current option.
     * If the predicate returns false for the option's value, returns a new empty option.
     *
     * @param predicate - The predicate function to filter the option.
     * @returns The filtered option.
     */
    filter(predicate: (value: T) => boolean) {
        return this.isSomeAnd(predicate) ? this : new Option(null)
    }
    /**
     * Returns this `Option` if it is `Some`, otherwise returns the provided `Option`.
     *
     * @param option - The `Option` to return if this `Option` is `None`.
     * @returns The current `Option` if it is `Some`, otherwise the provided `Option`.
     */
    or(option: Option<T>) {
        return this.isSome() ? this : option
    }
    /**
     * Returns this `Option` if it is `Some`, otherwise evaluates the given function `fn` and returns its result.
     *
     * @param fn - The function to be evaluated if this `Option` is `None`.
     * @returns The current `Option` if it is `Some`, otherwise the result of evaluating the function `fn`.
     */
    orElse(fn: () => Option<T>) {
        return this.isSome() ? this : fn()
    }
    /**
     * Returns a new Option that represents the exclusive or (XOR) operation between this Option and the provided Option.
     * If one of the Options is `Some` and the other is `None`, it returns the `Some` Option.
     * If both Options are `Some` or both are `None`, it returns a new `None` Option.
     *
     * @param option - The Option to perform the XOR operation with.
     * @returns A new Option representing the XOR operation between this Option and the provided Option.
     */
    xor(option: Option<T>) {
        return this.isSome() !== option.isSome() ? this : new Option(null)
    }
    /**
     * Throws an error with the specified message if the option is None.
     * Otherwise, returns the value of the option.
     *
     * @param message - The error message to throw if the option is None.
     * @returns The value of the option if it is Some.
     * @throws Error with the specified message if the option is None.
     */
    expect(message: string) {
        if (this.isNone()) {
            throw new Error(message)
        }
        return this.value as T
    }

    /**
     * Matches the given `option` against the provided patterns and returns the result.
     *
     * @template T - The type of the option value.
     * @template R - The type of the result.
     * @param {Option<T>} option - The option to match against.
     * @param {{ Some: (value: T) => R, None: () => R }} patterns - The patterns to match.
     * @returns {R} - The result of the matching pattern.
     */
    static match<T, R>(
        option: Option<T>,
        patterns: {
            Some: (value: T) => R
            None: () => R
        },
    ): R {
        return option.isSome()
            ? patterns.Some(option.unwrap())
            : patterns.None()
    }
}
