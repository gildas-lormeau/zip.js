[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TempStream

# Interface: TempStream

Defined in: [index.d.ts:400](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L400)

A `TransformStream`-like temporary buffer returned by a [ZipWriterConstructorOptions.createTempStream](ZipWriterConstructorOptions.md#createtempstream) factory.

## Properties

### dispose?

> `optional` **dispose?**: () => `void` \| `Promise`\<`void`\>

Defined in: [index.d.ts:412](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L412)

Optional cleanup, called once the entry has been processed (on success, error, or abort) to release any backing resource.

#### Returns

`void` \| `Promise`\<`void`\>

***

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:408](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L408)

The readable side, replayed into the final zip stream once the entry is ready.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:404](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L404)

The writable side, receiving the compressed data of a buffered entry.
