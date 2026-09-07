[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_CLAMPED\_LAST\_MODIFICATION\_DATE

# Variable: WARNING\_CLAMPED\_LAST\_MODIFICATION\_DATE

> `const` **WARNING\_CLAMPED\_LAST\_MODIFICATION\_DATE**: `string`

Warning reason: the last modification date is outside the range the MS-DOS field can hold, i.e. before 1980
or after 2107, and no extra field carries the original value, so the date written is the nearest bound
(see [ZipWriter#warnings](../classes/ZipWriter.md#warnings) and [EntryMetaData#lastModDate](../interfaces/EntryMetaData.md#lastmoddate))

## Remarks

[ZipWriterConstructorOptions#extendedTimestamp](../interfaces/ZipWriterConstructorOptions.md#extendedtimestamp) is enabled by default and preserves the
original value, so this reason only appears when it and [ZipWriterConstructorOptions#ntfsTimestamp](../interfaces/ZipWriterConstructorOptions.md#ntfstimestamp)
are both disabled.
