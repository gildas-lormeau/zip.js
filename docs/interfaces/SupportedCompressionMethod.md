[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SupportedCompressionMethod

# Interface: SupportedCompressionMethod

Represents the support of a compression method, see [getSupportedCompressionMethods](../functions/getSupportedCompressionMethods.md).

## Properties

### compression?

> `optional` **compression?**: `boolean`

`true` if entries can be compressed with the method. It is `undefined` when the support is
unknown, i.e. for a codec registered with [CodecDefinition#codecURI](CodecDefinition.md#codecuri) whose module has not
been imported yet.

***

### compressionMethod

> **compressionMethod**: `number`

The compression method stored in zip entry headers (e.g. `8` for Deflate).

***

### decompression?

> `optional` **decompression?**: `boolean`

`true` if entries can be decompressed with the method. It is `undefined` when the support is
unknown, i.e. for a codec registered with [CodecDefinition#codecURI](CodecDefinition.md#codecuri) whose module has not
been imported yet.

***

### registered

> **registered**: `boolean`

`true` if the method comes from a codec registered with [registerCodec](../functions/registerCodec.md).
