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

test('future rejection', async () => {
    const future = new Future<number, Error>((resolve, reject) => {
        setTimeout(() => reject(new Error('error')), 100)
    })
    expect(future.isPending()).toBe(true)
    try {
        await future
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
    }
    expect(future.isRejected()).toBe(true)
})

test('static ok method', async () => {
    const future = Future.ok(1)
    expect(future.isPending()).toBe(true)
    const v = await future
    expect(v).toBe(1)
    expect(future.isFulfilled()).toBe(true)
})

test('static err method', async () => {
    const future = Future.err(new Error('error'))
    expect(future.isPending()).toBe(true)
    try {
        await future
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
    }
    expect(future.isRejected()).toBe(true)
})

test('static from method', async () => {
    const promise = Promise.resolve(1)
    const future = Future.from(promise)
    expect(future.isPending()).toBe(true)
    const v = await future
    expect(v).toBe(1)
    expect(future.isFulfilled()).toBe(true)
})
