[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_MULTIPLE\_END\_OF\_CENTRAL\_DIRECTORY

# Variable: WARNING\_MULTIPLE\_END\_OF\_CENTRAL\_DIRECTORY

> `const` **WARNING\_MULTIPLE\_END\_OF\_CENTRAL\_DIRECTORY**: `string`

Warning reason: more than one end of central directory record reaches the end of the file, so another reader
may select a different one and list different entries; the reason of [ERR\_AMBIGUOUS\_ARCHIVE](ERR_AMBIGUOUS_ARCHIVE.md) when
[ZipReaderOptions#checkAmbiguity](../interfaces/ZipReaderOptions.md#checkambiguity) is enabled
