[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_CRC32

# Variable: ERR\_INVALID\_CRC32

> `const` **ERR\_INVALID\_CRC32**: `string`

Invalid CRC-32 checksum error, thrown when the [ZipReaderOptions#checkCrc32](../interfaces/ZipReaderOptions.md#checkcrc32) option is set and the CRC-32
checksum of an entry does not match the value stored in the zip file.

## Remarks

When the inflater verifies the checksum itself, through a gzip trailer that zip.js builds from the stored
CRC-32 and uncompressed size, it rejects the trailer as a whole and its error is kept as the `cause`. A
stored uncompressed size larger than the data therefore raises this error too on that route, whereas a
stored size smaller than the data raises [ERR\_INVALID\_UNCOMPRESSED\_SIZE](ERR_INVALID_UNCOMPRESSED_SIZE.md) on every route. Bytes
trailing the DEFLATE stream, e.g. a wrong `compressedSize`, displace that trailer, and an inflater that
reports them only once the real trailer has been written, as the one of Node.js does, raises this error
in place of [ERR\_INVALID\_COMPRESSED\_DATA](ERR_INVALID_COMPRESSED_DATA.md).
