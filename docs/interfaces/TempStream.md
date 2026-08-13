[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TempStream

# Interface: TempStream

Defined in: [index.d.ts:499](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L499)

A `TransformStream`-like temporary buffer returned by a [ZipWriterConstructorOptions.createTempStream](ZipWriterConstructorOptions.md#createtempstream) factory.

## Properties

### dispose?

> `optional` **dispose?**: () => `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:511](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L511)

Optional cleanup, called once the entry has been processed (on success, error, or abort) to release any backing resource.

#### Returns

`void` \| `Promise`\<`void`\>

***

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:507](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L507)

The readable side, replayed into the final zip stream once the entry is ready.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:503](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L503)

The writable side, receiving the compressed data of a buffered entry.
