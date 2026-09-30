[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_CRC32\_OR\_SIZES

# Variable: WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_CRC32\_OR\_SIZES

> `const` **WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_CRC32\_OR\_SIZES**: `string`

Warning reason: the crc32 or the sizes of the local file header, or of the data descriptor when it is read
(see [ZipReaderOptions#checkOverlappingEntry](../interfaces/ZipReaderOptions.md#checkoverlappingentry)), contradict the central directory
(see [EntryMetaData#warnings](../interfaces/EntryMetaData.md#warnings)); the reason of [ERR\_AMBIGUOUS\_ARCHIVE](ERR_AMBIGUOUS_ARCHIVE.md) when
[ZipReaderOptions#checkLocalDirectory](../interfaces/ZipReaderOptions.md#checklocaldirectory) is enabled
