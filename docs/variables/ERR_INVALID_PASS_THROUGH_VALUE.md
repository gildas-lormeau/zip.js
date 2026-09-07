[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_PASS\_THROUGH\_VALUE

# Variable: ERR\_INVALID\_PASS\_THROUGH\_VALUE

> `const` **ERR\_INVALID\_PASS\_THROUGH\_VALUE**: `string`

Invalid passThrough value error (thrown by [ZipReader#getEntries](../classes/ZipReader.md#getentries), [FileEntry#getData](../interfaces/FileEntry.md#getdata) and
[ZipWriter#add](../classes/ZipWriter.md#add) when the [ZipReaderOptions#passThrough](../interfaces/ZipReaderOptions.md#passthrough) or the
[ZipWriterConstructorOptions#passThrough](../interfaces/ZipWriterConstructorOptions.md#passthrough) option is neither a boolean, `"compressed"` nor unset)

## Remarks

The option accepts a fixed set of values rather than any truthy one, because a misspelled string would
otherwise pass both codec stages through and produce an archive holding data which is not the data the caller
meant to write, with no error at any point.
