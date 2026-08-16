[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_CRC32

# Variable: ERR\_INVALID\_CRC32

> `const` **ERR\_INVALID\_CRC32**: `string`

Invalid CRC-32 checksum error, thrown when the [ZipReaderOptions#checkCrc32](../interfaces/ZipReaderOptions.md#checkcrc32) option is set and the CRC-32
checksum of an entry does not match the value stored in the zip file.

## Remarks

This constant and [ERR\_INVALID\_AUTHENTICATION\_CODE](ERR_INVALID_AUTHENTICATION_CODE.md) share the same value as [ERR\_INVALID\_SIGNATURE](ERR_INVALID_SIGNATURE.md)
for backward compatibility. They will become distinct strings in the next minor version.
