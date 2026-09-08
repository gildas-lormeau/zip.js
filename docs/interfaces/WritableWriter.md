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

The number of bytes written into the instance. It is set to 0 before the first write, and a value
set beforehand is kept and used as the starting offset instead of being reset to 0.

The bytes of a section are added once that section is written, so the value is settled between
entries rather than after every chunk: an instance reading it from its own `write()` method sees
the total of the sections already finished. The exception is an instance yielded by a generator of
split disks, which is updated on each chunk written to it, so it can compute the offset of the disk
it is filling.

It must therefore be assignable, see [ERR\_WRITER\_SIZE\_NOT\_WRITABLE](../variables/ERR_WRITER_SIZE_NOT_WRITABLE.md): a getter with no setter
is rejected when the writer is passed, not once the first entry has been written.

***

### writable

> **writable**: `WritableStream`

The `WritableStream` instance.
