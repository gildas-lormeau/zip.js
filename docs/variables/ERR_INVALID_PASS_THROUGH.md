[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_PASS\_THROUGH

# Variable: ERR\_INVALID\_PASS\_THROUGH

> `const` **ERR\_INVALID\_PASS\_THROUGH**: `string`

Invalid passThrough option error (thrown by `{@link ZipDirectoryEntry}#export*()` and
[ZipDirectoryEntry#getExportedSize](../classes/ZipDirectoryEntry.md#getexportedsize) when an entry would be written as-is without a known uncompressed size)

## Remarks

The [ZipWriterConstructorOptions#passThrough](../interfaces/ZipWriterConstructorOptions.md#passthrough) option describes the data returned by the Reader
instances, which the filesystem API creates itself. Use the [ZipReaderOptions#passThrough](../interfaces/ZipReaderOptions.md#passthrough) option in the
[ZipDirectoryEntryExportOptions#readerOptions](../interfaces/ZipDirectoryEntryExportOptions.md#readeroptions) option to export the entries imported from a zip file as-is,
or set the [ZipWriterAddDataOptions#uncompressedSize](../interfaces/ZipWriterAddDataOptions.md#uncompressedsize) option of each entry holding compressed data.
