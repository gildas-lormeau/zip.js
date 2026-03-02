[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpRangeOptions

# Interface: HttpRangeOptions

Defined in: [index.d.ts:496](https://github.com/gildas-lormeau/zip.js/blob/cb98d947a8c3e1ef844312562441b85f96dc3463/index.d.ts#L496)

Represents options passed to the constructor of [HttpRangeReader](../classes/HttpRangeReader.md) and [HttpReader](../classes/HttpReader.md).

## Extended by

- [`HttpOptions`](HttpOptions.md)

## Properties

### headers?

> `optional` **headers**: `Iterable`\<\[`string`, `string`\], `any`, `any`\> \| `Map`\<`string`, `string`\>

Defined in: [index.d.ts:506](https://github.com/gildas-lormeau/zip.js/blob/cb98d947a8c3e1ef844312562441b85f96dc3463/index.d.ts#L506)

The HTTP headers.

***

### useXHR?

> `optional` **useXHR**: `boolean`

Defined in: [index.d.ts:502](https://github.com/gildas-lormeau/zip.js/blob/cb98d947a8c3e1ef844312562441b85f96dc3463/index.d.ts#L502)

`true` to rely `XMLHttpRequest` instead of `fetch` to fetch data.

#### Default Value

```ts
false
```
