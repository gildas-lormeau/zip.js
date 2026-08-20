[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / DecompressionStreamOptions

# Interface: DecompressionStreamOptions

Represents the options passed as the second argument to the constructor of the classes
decompressing data, i.e. [CodecDefinition#DecompressionStream](CodecDefinition.md#decompressionstream),
[Configuration#DecompressionStream](Configuration.md#decompressionstream) and [Configuration#DecompressionStreamFallback](Configuration.md#decompressionstreamfallback).

## Properties

### chunkSize?

> `optional` **chunkSize?**: `number`

The size of the chunks in bytes, see [Configuration#chunkSize](Configuration.md#chunksize).

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

The compression method of the entry. It allows codecs registered for several methods sharing
the same format to distinguish them (e.g. Reduce, methods 2 to 5).

It is only set for the codecs registered with [registerCodec](../functions/registerCodec.md).

***

### deflate64?

> `optional` **deflate64?**: `boolean`

`true` when the data is compressed with the Deflate64 method, the format passed as the first
argument being `"deflate64-raw"` instead of `"deflate-raw"`.

It is only set for the classes decompressing the deflate methods, i.e.
[Configuration#DecompressionStream](Configuration.md#decompressionstream) and [Configuration#DecompressionStreamFallback](Configuration.md#decompressionstreamfallback).

***

### rawBitFlag?

> `optional` **rawBitFlag?**: `number`

The general purpose bit flag of the entry, which some methods need to decode the data (e.g. the
dictionary size and the number of trees of Implode, or the presence of the end-of-stream marker
of LZMA).

It is only set for the codecs registered with [registerCodec](../functions/registerCodec.md).

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

The uncompressed size of the entry declared in its header, undefined when the size is unknown.
It allows size-driven decoders (e.g. Shrink, Reduce, Implode, LZMA without end-of-stream
marker) to stop at the exact output size instead of decoding trailing padding bits.

It is only set for the codecs registered with [registerCodec](../functions/registerCodec.md).
