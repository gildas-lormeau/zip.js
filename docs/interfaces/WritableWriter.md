[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Defined in: [index.d.ts:506](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L506)

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize**: `number`

Defined in: [index.d.ts:514](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L514)

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [FileEntry#getData](FileEntry.md#getdata) with a generator of WritableWriter instances.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:510](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L510)

The `WritableStream` instance.
