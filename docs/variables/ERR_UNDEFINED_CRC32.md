[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNDEFINED\_CRC32

# Variable: ERR\_UNDEFINED\_CRC32

> `const` **ERR\_UNDEFINED\_CRC32**: `string`

Undefined CRC32 error (thrown by [ZipWriter#add](../classes/ZipWriter.md#add) when the [ZipWriterConstructorOptions#passThrough](../interfaces/ZipWriterConstructorOptions.md#passthrough)
option is set and the [ZipWriterAddDataOptions#crc32](../interfaces/ZipWriterAddDataOptions.md#crc32) option is unset on an entry which stores a checksum)

## Remarks

The checksum cannot be computed from data which is not decompressed, and every entry stores one except
an AES entry in AE-2 format, so writing the data as-is without declaring it would store a zero which other tools
reject. Copying an entry read with the [ZipReaderOptions#passThrough](../interfaces/ZipReaderOptions.md#passthrough) option set to `"compressed"` from an
AE-2 source into an entry which is not AES-encrypted is therefore refused rather than written: that source
published no checksum to carry over.
