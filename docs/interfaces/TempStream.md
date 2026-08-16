[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TempStream

# Interface: TempStream

Defined in: [index.d.ts:501](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L501)

A `TransformStream`-like temporary buffer returned by a [ZipWriterConstructorOptions.createTempStream](ZipWriterConstructorOptions.md#createtempstream) factory.

## Properties

### dispose?

> `optional` **dispose?**: () => `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:513](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L513)

Optional cleanup, called once the entry has been processed (on success, error, or abort) to release any backing resource.

#### Returns

`void` \| `Promise`\<`void`\>

***

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:509](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L509)

The readable side, replayed into the final zip stream once the entry is ready.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:505](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L505)

The writable side, receiving the compressed data of a buffered entry.
