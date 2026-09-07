[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_READER

# Variable: ERR\_INVALID\_READER

> `const` **ERR\_INVALID\_READER**: `string`

Invalid reader error

## Remarks

Thrown when the second argument of [ZipWriter#add](../classes/ZipWriter.md#add) is neither a [Reader](../classes/Reader.md) instance, a
`ReadableStream` instance, nor an object exposing a `readable` property. A `Blob`, a string or a
`Uint8Array` must be wrapped in the matching Reader class, e.g. [BlobReader](../classes/BlobReader.md), [TextReader](../classes/TextReader.md)
or [Uint8ArrayReader](../classes/Uint8ArrayReader.md).
