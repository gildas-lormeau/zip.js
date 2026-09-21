[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_UNCOMPRESSED\_SIZE

# Variable: ERR\_INVALID\_UNCOMPRESSED\_SIZE

> `const` **ERR\_INVALID\_UNCOMPRESSED\_SIZE**: `string`

Invalid uncompressed size error, thrown when an entry inflates to more bytes than its stored uncompressed size.

## Remarks

An entry encrypted with AES that stores no CRC-32 (AE-2) raises this error when it inflates to fewer bytes
as well, since the end of its data is told by the stored size alone, when it is inflated through a gzip
container: on a host whose native inflater lacks `"deflate-raw"`, when the bundled codec cannot take over
either, e.g. because its WASM module failed to load.
