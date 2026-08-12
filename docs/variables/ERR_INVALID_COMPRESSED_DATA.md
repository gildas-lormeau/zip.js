[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_COMPRESSED\_DATA

# Variable: ERR\_INVALID\_COMPRESSED\_DATA

> `const` **ERR\_INVALID\_COMPRESSED\_DATA**: `string`

Defined in: [index.d.ts:2960](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L2960)

Invalid compressed data error

## Remarks

The way malformed compressed data is reported is not uniform across codec
backends. Bytes trailing a complete DEFLATE stream (e.g. a wrong
`compressedSize`) are tolerated by the bundled WASM and pure-JS codecs, which
decompress the valid data and ignore the extra bytes, but are rejected by the
native `DecompressionStream` with its own `TypeError` (on Node,
`ERR_TRAILING_JUNK_AFTER_STREAM_END`) rather than this error. Any data that is
returned is always validated against the entry's uncompressed size (and CRC
when `checkSignature` is set), so it is never silently truncated; the backends
differ only in whether trailing bytes are ignored or raised as an error.
