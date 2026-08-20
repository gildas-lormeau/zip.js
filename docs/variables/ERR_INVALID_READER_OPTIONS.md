[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_READER\_OPTIONS

# Variable: ERR\_INVALID\_READER\_OPTIONS

> `const` **ERR\_INVALID\_READER\_OPTIONS**: `string`

Invalid readerOptions error (thrown by `{@link ZipDirectoryEntry}#export*()`,
[ZipDirectoryEntry#getExportedSize](../classes/ZipDirectoryEntry.md#getexportedsize) and [ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle) when the
[ZipDirectoryEntryExportOptions#readerOptions](../interfaces/ZipDirectoryEntryExportOptions.md#readeroptions) option is neither an object nor unset)

## Remarks

A value of another type was silently ignored: a password passed as a string instead of an object failed
with the unrelated [ERR\_ENCRYPTED](ERR_ENCRYPTED.md), while the other options were dropped without any error. Note that an
unknown property of a `readerOptions` object is still ignored, as everywhere else in the API.
