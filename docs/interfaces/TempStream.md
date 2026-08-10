[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TempStream

# Interface: TempStream

Defined in: [index.d.ts:392](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L392)

A `TransformStream`-like temporary buffer returned by a [ZipWriterConstructorOptions.createTempStream](ZipWriterConstructorOptions.md#createtempstream) factory.

## Properties

### dispose?

> `optional` **dispose?**: () => `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:404](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L404)

Optional cleanup, called once the entry has been processed (on success, error, or abort) to release any backing resource.

#### Returns

`void` \| `Promise`\<`void`\>

***

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:400](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L400)

The readable side, replayed into the final zip stream once the entry is ready.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:396](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L396)

The writable side, receiving the compressed data of a buffered entry.
