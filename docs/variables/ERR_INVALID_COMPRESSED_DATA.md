[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_COMPRESSED\_DATA

# Variable: ERR\_INVALID\_COMPRESSED\_DATA

> `const` **ERR\_INVALID\_COMPRESSED\_DATA**: `string`

Defined in: [index.d.ts:3033](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L3033)

Invalid compressed data error

## Remarks

The way malformed compressed data is reported is not uniform across codec
backends. Bytes trailing a complete DEFLATE stream (e.g. a wrong
`compressedSize`) are tolerated by the bundled WASM and pure-JS codecs, which
decompress the valid data and ignore the extra bytes, but are rejected by the
native `DecompressionStream` with its own `TypeError` (on Node,
`ERR_TRAILING_JUNK_AFTER_STREAM_END`) rather than this error. Any data that is
returned is always validated against the entry's uncompressed size (and CRC
when `checkCrc32` is set), so it is never silently truncated; the backends
differ only in whether trailing bytes are ignored or raised as an error.
