[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpRangeOptions

# Interface: HttpRangeOptions

Defined in: [index.d.ts:454](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L454)

Represents options passed to the constructor of [HttpRangeReader](../classes/HttpRangeReader.md) and [HttpReader](../classes/HttpReader.md).

## Extended by

- [`HttpOptions`](HttpOptions.md)

## Properties

### headers?

> `optional` **headers**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:464](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L464)

The HTTP headers.

***

### useXHR?

> `optional` **useXHR**: `boolean`

Defined in: [index.d.ts:460](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L460)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```
