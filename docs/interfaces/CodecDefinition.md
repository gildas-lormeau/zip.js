[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CodecDefinition

# Interface: CodecDefinition

Defined in: [index.d.ts:227](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L227)

Represents a codec definition passed to [registerCodec](../functions/registerCodec.md).

## Properties

### codecURI?

> `optional` **codecURI?**: `string`

Defined in: [index.d.ts:243](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L243)

The URL of a module exporting the `CompressionStream` and/or `DecompressionStream` classes of
the codec. Relative URLs are resolved against `Configuration#baseURI`; passing an absolute URL
(e.g. via `import.meta.resolve()`) is recommended.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:232](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L232)

The compression method stored in zip entry headers (e.g. `93` for Zstandard). The values `0`
(store), `8` (deflate), `9` (deflate64) and `99` (AES) are reserved.

***

### CompressionStream?

> `optional` **CompressionStream?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:247](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L247)

The stream implementation used to compress data, constructed with `(format, { level, chunkSize })`.

***

### DecompressionStream?

> `optional` **DecompressionStream?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:251](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L251)

The stream implementation used to decompress data, constructed with `(format, { chunkSize })`.

***

### format

> **format**: `string`

Defined in: [index.d.ts:237](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L237)

The format name identifying the codec (e.g. `"zstd"`). It is passed as the first argument to
the constructors of `CompressionStream` and `DecompressionStream`.

***

### versionNeeded?

> `optional` **versionNeeded?**: `number`

Defined in: [index.d.ts:256](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L256)

The minimum "version needed to extract" value written in zip entry headers (e.g. `63` for
Zstandard).
