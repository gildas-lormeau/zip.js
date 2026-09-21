[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_COMPRESSED\_DATA

# Variable: ERR\_INVALID\_COMPRESSED\_DATA

> `const` **ERR\_INVALID\_COMPRESSED\_DATA**: `string`

Invalid compressed data error, thrown when the codec rejects the compressed data of an entry.

## Remarks

The error is the same whatever inflates the data, and the error the codec raised is kept as its
`cause`: the `TypeError` of a native `DecompressionStream`, whose message depends on the engine,
or the error of the bundled WASM or pure-JS codec. An error raised while reading the data, e.g.
by the reader of the zip file or by the decryption of the entry, is not a codec failure and
reaches the caller unchanged.

The codecs do not all reject the same data. Bytes trailing a complete DEFLATE stream (e.g. a
wrong `compressedSize`) are rejected by the native `DecompressionStream` (on Node.js, with
`ERR_TRAILING_JUNK_AFTER_STREAM_END` as the `code` of the cause) but tolerated by the bundled
WASM and pure-JS codecs, which decompress the valid data and ignore the extra bytes, unless
[ZipReaderOptions#checkCrc32](../interfaces/ZipReaderOptions.md#checkcrc32) makes them verify the checksum through a gzip trailer that
the extra bytes displace. Any data that is returned is always validated against the entry's
uncompressed size (and CRC when `checkCrc32` is set), so it is never silently truncated; the
backends differ only in whether trailing bytes are ignored or raised as an error.
