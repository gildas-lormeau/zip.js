[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CodecDefinition

# Interface: CodecDefinition

Represents a codec definition passed to [registerCodec](../functions/registerCodec.md).

## Properties

### codecURI?

> `optional` **codecURI?**: `string`

The URL of a module exporting the `CompressionStream` and/or `DecompressionStream` classes of
the codec. Relative URLs are resolved against [Configuration#baseURI](Configuration.md#baseuri); passing an absolute
URL (e.g. via `import.meta.resolve()`) is recommended.

***

### compressionMethod

> **compressionMethod**: `number`

The compression method stored in zip entry headers (e.g. `93` for Zstandard). The values `0`
(store), `8` (deflate), `9` (deflate64) and `99` (AES) are reserved.

***

### CompressionStream?

> `optional` **CompressionStream?**: *typeof* [`CompressionStreamLike`](../classes/CompressionStreamLike.md)

The stream implementation used to compress data, constructed with `(format, options)`, see
[CompressionStreamOptions](CompressionStreamOptions.md).

***

### DecompressionStream?

> `optional` **DecompressionStream?**: *typeof* [`DecompressionStreamLike`](../classes/DecompressionStreamLike.md)

The stream implementation used to decompress data, constructed with `(format, options)`, see
[DecompressionStreamOptions](DecompressionStreamOptions.md).

***

### format

> **format**: `string`

The format name identifying the codec (e.g. `"zstd"`). It is passed as the first argument to
the constructors of `CompressionStream` and `DecompressionStream`.

***

### versionNeeded?

> `optional` **versionNeeded?**: `number`

The minimum "version needed to extract" value written in zip entry headers (e.g. `63` for
Zstandard).
