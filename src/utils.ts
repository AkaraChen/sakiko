export function toError<E extends Error>(e: E | string): E {
    return e instanceof Error ? e : (new Error(e) as E)
}
