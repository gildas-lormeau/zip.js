[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_FUNCTION\_OPTION

# Variable: ERR\_INVALID\_FUNCTION\_OPTION

> `const` **ERR\_INVALID\_FUNCTION\_OPTION**: `string`

Invalid function option error

## Remarks

Thrown when an option expecting a function is given a value of another type: [ZipWriterConstructorOptions#encodeText](../interfaces/ZipWriterConstructorOptions.md#encodetext),
[GetEntriesOptions#decodeText](../interfaces/GetEntriesOptions.md#decodetext), [ZipWriterConstructorOptions#createTempStream](../interfaces/ZipWriterConstructorOptions.md#createtempstream),
[ZipWriterCloseOptions#signCentralDirectory](../interfaces/ZipWriterCloseOptions.md#signcentraldirectory) and [GetEntriesOptions#decryptCentralDirectory](../interfaces/GetEntriesOptions.md#decryptcentraldirectory). It is also
thrown by [configure](../functions/configure.md) for [Configuration#createWorker](../interfaces/Configuration.md#createworker), [Configuration#CompressionStream](../interfaces/Configuration.md#compressionstream),
[Configuration#DecompressionStream](../interfaces/Configuration.md#decompressionstream), [Configuration#CompressionStreamFallback](../interfaces/Configuration.md#compressionstreamfallback) and
[Configuration#DecompressionStreamFallback](../interfaces/Configuration.md#decompressionstreamfallback). A falsy value keeps meaning "use the default".
