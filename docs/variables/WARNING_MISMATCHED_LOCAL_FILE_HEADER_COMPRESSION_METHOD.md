[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_COMPRESSION\_METHOD

# Variable: WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_COMPRESSION\_METHOD

> `const` **WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_COMPRESSION\_METHOD**: `string`

Warning reason: the compression method of the local file header contradicts the central directory
(see [EntryMetaData#warnings](../interfaces/EntryMetaData.md#warnings)); the reason of [ERR\_AMBIGUOUS\_ARCHIVE](ERR_AMBIGUOUS_ARCHIVE.md) when
[ZipReaderOptions#checkLocalDirectory](../interfaces/ZipReaderOptions.md#checklocaldirectory) is enabled
