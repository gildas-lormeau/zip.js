[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CompressionStreamOptions

# Interface: CompressionStreamOptions

Represents the options passed as the second argument to the constructor of the classes
compressing data, i.e. [CodecDefinition#CompressionStream](CodecDefinition.md#compressionstream),
[Configuration#CompressionStream](Configuration.md#compressionstream) and [Configuration#CompressionStreamFallback](Configuration.md#compressionstreamfallback).

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

### level?

> `optional` **level?**: `number`

The compression level, see [ZipWriterConstructorOptions#level](ZipWriterConstructorOptions.md#level).
