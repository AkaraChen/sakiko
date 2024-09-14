# sakiko

> Deprecated, use [Effect-ts](https://effect.website) instead.

Some monad implement with js.

[Document](https://sakiko.vercel.app)

## Option

Use to handle null or undefined value.

```js
import { Option } from 'sakiko'

const value = Option.some(1)
    .map(v => v + 1)
    .map(v => v * 2)
    .unwrapOr(0)
```

## Result

Use to handle error.

```js
import { Result } from 'sakiko'

const value = Result.ok(1)
    .isOkAnd(v => v >= 0)
    .map(v => v + 1)
    .unwrapOr(0)
```

## Future

A wrapper of Promise. Provide a powerful way to handle async code.

```js
import { Future } from 'sakiko'

const future = Future.from(async () => {
    // do something async
})

// at any time
future.isOk() // true if the future is resolved

// Or you can map to `Result`
const result = await future.result()
result.unwrapOr(0)
```
