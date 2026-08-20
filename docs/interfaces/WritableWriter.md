[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize?**: `number`

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [FileEntry#getData](FileEntry.md#getdata) with a generator of WritableWriter instances.

***

### size?

> `optional` **size?**: `number`

The number of bytes written into the instance. It is set to 0 before the first write and
updated as the data is written, so a writer needing the value (e.g. to compute the offset of a
disk) can read it.

***

### writable

> **writable**: `WritableStream`

The `WritableStream` instance.
