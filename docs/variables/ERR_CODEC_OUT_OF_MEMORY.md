[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_CODEC\_OUT\_OF\_MEMORY

# Variable: ERR\_CODEC\_OUT\_OF\_MEMORY

> `const` **ERR\_CODEC\_OUT\_OF\_MEMORY**: `string`

Codec out of memory error, thrown when the codec of an entry cannot allocate the memory it needs, e.g. when
the fixed heap of the bundled WASM module is exhausted by too many entries processed concurrently in the same
scope.

## Remarks

The error the codec raised is kept as the `cause`. The failure is recognized by the `code` property of that
error, `"Z_MEM_ERROR"`, which the bundled WASM codec sets and the native `DecompressionStream` of Node.js
would set; a codec reporting the failure without it is reported as [ERR\_INVALID\_COMPRESSED\_DATA](ERR_INVALID_COMPRESSED_DATA.md) when
reading, or with its own error when writing. When writing, only a codec that fails to allocate its state is
reported with this error: a failure while compressing keeps the error of the codec.
