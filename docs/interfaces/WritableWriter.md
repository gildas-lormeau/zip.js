[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Defined in: [index.d.ts:636](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L636)

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize**: `number`

Defined in: [index.d.ts:644](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L644)

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [FileEntry#getData](FileEntry.md#getdata) with a generator of WritableWriter instances.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:640](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L640)

The `WritableStream` instance.
