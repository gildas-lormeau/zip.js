[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpRangeOptions

# Interface: HttpRangeOptions

Defined in: [index.d.ts:479](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L479)

Represents options passed to the constructor of [HttpRangeReader](../classes/HttpRangeReader.md) and [HttpReader](../classes/HttpReader.md).

## Extended by

- [`HttpOptions`](HttpOptions.md)

## Properties

### headers?

> `optional` **headers**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:489](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L489)

The HTTP headers.

***

### useXHR?

> `optional` **useXHR**: `boolean`

Defined in: [index.d.ts:485](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L485)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```
