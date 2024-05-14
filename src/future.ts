import { __TAG__ } from './symbols'

export class Future<T, E> extends Promise<T> {
    [__TAG__]: 'Pending' | 'Fulfilled' | 'Rejected'
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
        this[__TAG__] = 'Pending'
        executor(
            value => {
                this[__TAG__] = 'Fulfilled'
                resolve(value)
            },
            error => {
                this[__TAG__] = 'Rejected'
                reject(error)
            },
        )
    }
    static ok<T, E>(value: T) {
        return Future.from(Promise.resolve(value))
    }
    static err<T, E>(error: E) {
        return Future.from(Promise.reject(error))
    }
    static from<T, E>(promise: Promise<T>) {
        return new Future<T, E>((resolve, reject) => {
            promise.then(resolve).catch(reject)
        })
    }
    isPending() {
        return this[__TAG__] === 'Pending'
    }
    isFulfilled() {
        return this[__TAG__] === 'Fulfilled'
    }
    isRejected() {
        return this[__TAG__] === 'Rejected'
    }
}
