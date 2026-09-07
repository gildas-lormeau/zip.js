[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNSUPPORTED\_PASS\_THROUGH\_VALUE

# Variable: ERR\_UNSUPPORTED\_PASS\_THROUGH\_VALUE

> `const` **ERR\_UNSUPPORTED\_PASS\_THROUGH\_VALUE**: `string`

Unsupported passThrough value error (thrown by [ZipDirectoryEntry#importZip](../classes/ZipDirectoryEntry.md#importzip) and by
`{@link ZipDirectoryEntry}#export*()` when the [ZipReaderOptions#passThrough](../interfaces/ZipReaderOptions.md#passthrough) option is set to
`"compressed"`)

## Remarks

The filesystem API copies the entries of an imported zip file verbatim, forwarding the encryption
metadata of each source entry to the Writer. Data which has been decrypted but not decompressed would be written
under that metadata, i.e. an archive whose entries are marked encrypted over content which is not, so the value
is refused rather than accepted and mishandled. Use [FileEntry#getData](../interfaces/FileEntry.md#getdata) and [ZipWriter#add](../classes/ZipWriter.md#add) directly
to decrypt an entry without decompressing it.
