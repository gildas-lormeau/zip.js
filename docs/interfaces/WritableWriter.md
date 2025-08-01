[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Defined in: [index.d.ts:638](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L638)

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize**: `number`

Defined in: [index.d.ts:646](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L646)

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [FileEntry#getData](FileEntry.md#getdata) with a generator of WritableWriter instances.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:642](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L642)

The `WritableStream` instance.
