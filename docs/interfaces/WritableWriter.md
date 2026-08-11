[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Defined in: [index.d.ts:757](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L757)

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize?**: `number`

Defined in: [index.d.ts:765](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L765)

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [FileEntry#getData](FileEntry.md#getdata) with a generator of WritableWriter instances.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:761](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L761)

The `WritableStream` instance.
