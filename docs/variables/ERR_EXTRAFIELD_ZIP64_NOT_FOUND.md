[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_EXTRAFIELD\_ZIP64\_NOT\_FOUND

# Variable: ERR\_EXTRAFIELD\_ZIP64\_NOT\_FOUND

> `const` **ERR\_EXTRAFIELD\_ZIP64\_NOT\_FOUND**: `string`

Extra field Zip64 not found error

## Remarks

Raised by [ZipReader#getEntries](../classes/ZipReader.md#getentries) when the Zip64 extra field of a central directory record is missing or
too short to hold the values that the `0xFFFFFFFF` and `0xFFFF` sentinels of the record defer to it, since the
sizes and the offset of the entry have no other source. The same defect in a local file header is not fatal, because
the sizes of an entry are read from the central directory: [FileEntry#getData](../interfaces/FileEntry.md#getdata) reports it as
[WARNING\_MALFORMED\_EXTRA\_FIELD](WARNING_MALFORMED_EXTRA_FIELD.md) on [EntryMetaData#warnings](../interfaces/EntryMetaData.md#warnings), and an entry without a data descriptor
keeps the sentinels as its local sizes, which the local file header check reports as
[WARNING\_MISMATCHED\_LOCAL\_FILE\_HEADER\_CRC32\_OR\_SIZES](WARNING_MISMATCHED_LOCAL_FILE_HEADER_CRC32_OR_SIZES.md), an error or a warning depending on
[ZipReaderOptions#strictness](../interfaces/ZipReaderOptions.md#strictness).
