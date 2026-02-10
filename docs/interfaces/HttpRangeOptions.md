[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpRangeOptions

# Interface: HttpRangeOptions

Defined in: [index.d.ts:490](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L490)

Represents options passed to the constructor of [HttpRangeReader](../classes/HttpRangeReader.md) and [HttpReader](../classes/HttpReader.md).

## Extended by

- [`HttpOptions`](HttpOptions.md)

## Properties

### headers?

> `optional` **headers**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:500](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L500)

The HTTP headers.

***

### useXHR?

> `optional` **useXHR**: `boolean`

Defined in: [index.d.ts:496](https://github.com/gildas-lormeau/zip.js/blob/b608fddabb61e5afd1bc745020be38a96affbdb8/index.d.ts#L496)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```
