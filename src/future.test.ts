import { Future } from './future'
import { test, expect, vi } from 'vitest'

test('future creation', async () => {
    const future = new Future<number, Error>(resolve => {
        setTimeout(() => resolve(1), 100)
    })
    expect(future.isPending()).toBe(true)
    const v = await future
    expect(v).toBe(1)
    expect(future.isFulfilled()).toBe(true)
    const reject = Future.err('error')
    const fn = vi.fn()
    try {
        await reject
    } catch (error) {
        fn()
    }
    expect(fn).toHaveBeenCalled()
    expect(reject.isRejected()).toBe(true)
    expect(Future.from(Promise.resolve(1)).isPending()).toBe(true)
})
