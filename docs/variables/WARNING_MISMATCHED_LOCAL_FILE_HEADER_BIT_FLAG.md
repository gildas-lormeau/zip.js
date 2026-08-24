[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_BIT\_FLAG

# Variable: WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_BIT\_FLAG

> `const` **WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_BIT\_FLAG**: `string`

Warning reason: the general purpose bit flag of the local file header contradicts the central directory
(see [EntryMetaData#warnings](../interfaces/EntryMetaData.md#warnings)); the reason of [ERR\_AMBIGUOUS\_ARCHIVE](ERR_AMBIGUOUS_ARCHIVE.md) when
[ZipReaderOptions#checkLocalDirectory](../interfaces/ZipReaderOptions.md#checklocaldirectory) is enabled
