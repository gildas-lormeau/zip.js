[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_ZIP\_CRYPTO\_LAST\_MOD\_DATE

# Variable: ERR\_ZIP\_CRYPTO\_LAST\_MOD\_DATE

> `const` **ERR\_ZIP\_CRYPTO\_LAST\_MOD\_DATE**: `string`

Locked last modification date error (thrown by `{@link ZipDirectoryEntry}#export*()` and
[ZipDirectoryEntry#getExportedSize](../classes/ZipDirectoryEntry.md#getexportedsize) when the date of an entry encrypted with ZipCrypto and exported with
[ZipReaderOptions#passThrough](../interfaces/ZipReaderOptions.md#passthrough) set in [ZipDirectoryEntryExportOptions#readerOptions](../interfaces/ZipDirectoryEntryExportOptions.md#readeroptions) is changed)

## Remarks

The ZipCrypto encryption header embeds a password verification byte derived from the time of the
entry: the encrypted data, copied as-is, only decrypts when the time in the rewritten headers still matches.
The error is thrown when the new date would prevent the entry from being decrypted; changes which keep the
verification byte intact, e.g. a change of the day only, are written normally.
