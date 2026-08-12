[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CodecDefinition

# Interface: CodecDefinition

Defined in: [index.d.ts:227](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L227)

Represents a codec definition passed to [registerCodec](../functions/registerCodec.md).

## Properties

### codecURI?

> `optional` **codecURI?**: `string`

Defined in: [index.d.ts:243](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L243)

The URL of a module exporting the `CompressionStream` and/or `DecompressionStream` classes of
the codec. Relative URLs are resolved against `Configuration#baseURI`; passing an absolute URL
(e.g. via `import.meta.resolve()`) is recommended.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:232](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L232)

The compression method stored in zip entry headers (e.g. `93` for Zstandard). The values `0`
(store), `8` (deflate), `9` (deflate64) and `99` (AES) are reserved.

***

### CompressionStream?

> `optional` **CompressionStream?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:248](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L248)

The stream implementation used to compress data, constructed with
`(format, { level, chunkSize, compressionMethod })`.

***

### DecompressionStream?

> `optional` **DecompressionStream?**: *typeof* [`TransformStreamLike`](../classes/TransformStreamLike.md)

Defined in: [index.d.ts:260](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L260)

The stream implementation used to decompress data, constructed with
`(format, { chunkSize, compressionMethod, rawBitFlag, uncompressedSize })`.

`compressionMethod` allows codecs registered for multiple methods with the same format to
distinguish them (e.g. Reduce, methods 2 to 5). `rawBitFlag` exposes the general purpose bit
flag of the entry, which some methods need to decode the data (e.g. the dictionary size and
number of trees of Implode, or the end-of-stream marker presence of LZMA). `uncompressedSize`
allows size-driven decoders (e.g. Shrink, Reduce, Implode, LZMA without end-of-stream marker)
to stop at the exact output size instead of decoding trailing padding bits.

***

### format

> **format**: `string`

Defined in: [index.d.ts:237](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L237)

The format name identifying the codec (e.g. `"zstd"`). It is passed as the first argument to
the constructors of `CompressionStream` and `DecompressionStream`.

***

### versionNeeded?

> `optional` **versionNeeded?**: `number`

Defined in: [index.d.ts:265](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L265)

The minimum "version needed to extract" value written in zip entry headers (e.g. `63` for
Zstandard).
