[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_FUNCTION\_OPTION

# Variable: ERR\_INVALID\_FUNCTION\_OPTION

> `const` **ERR\_INVALID\_FUNCTION\_OPTION**: `string`

Invalid function option error

## Remarks

Thrown when an option expecting a function is given a value of another type: [ZipWriterConstructorOptions#encodeText](../interfaces/ZipWriterConstructorOptions.md#encodetext),
[GetEntriesOptions#decodeText](../interfaces/GetEntriesOptions.md#decodetext), [ZipWriterConstructorOptions#createTempStream](../interfaces/ZipWriterConstructorOptions.md#createtempstream),
[ZipWriterCloseOptions#signCentralDirectory](../interfaces/ZipWriterCloseOptions.md#signcentraldirectory) and [GetEntriesOptions#decryptCentralDirectory](../interfaces/GetEntriesOptions.md#decryptcentraldirectory). A falsy value
keeps meaning "use the default".
