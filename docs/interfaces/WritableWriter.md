[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Defined in: [index.d.ts:512](https://github.com/gildas-lormeau/zip.js/blob/5c4c70530bd9d879d516e190202125e09cc8106f/index.d.ts#L512)

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize?**: `number`

Defined in: [index.d.ts:520](https://github.com/gildas-lormeau/zip.js/blob/5c4c70530bd9d879d516e190202125e09cc8106f/index.d.ts#L520)

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [FileEntry#getData](FileEntry.md#getdata) with a generator of WritableWriter instances.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:516](https://github.com/gildas-lormeau/zip.js/blob/5c4c70530bd9d879d516e190202125e09cc8106f/index.d.ts#L516)

The `WritableStream` instance.
