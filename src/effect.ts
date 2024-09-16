import { Effect, Option } from 'effect'
import { Option as RawOption } from './option'
import { Result as RawResult } from './result'
import { Future as RawFuture } from './future'

export function option<T>(input: RawOption<T>): Option.Option<T> {
    return Option.fromNullable(input.value)
}

export function effect<T, E extends Error>(
    input: RawResult<T, E> | RawFuture<T, E>,
) {
    if (RawFuture.isFuture(input)) {
        return Effect.tryPromise(async () => {
            return await input
        })
    }
    if (RawResult.isResult(input)) {
        return Effect.try(() => {
            return input
        })
    }
}
