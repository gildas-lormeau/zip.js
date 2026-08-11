[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Defined in: [index.d.ts:748](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L748)

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize?**: `number`

Defined in: [index.d.ts:756](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L756)

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [FileEntry#getData](FileEntry.md#getdata) with a generator of WritableWriter instances.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:752](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L752)

The `WritableStream` instance.
