[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_MALFORMED\_EXTRA\_FIELD

# Variable: WARNING\_MALFORMED\_EXTRA\_FIELD

> `const` **WARNING\_MALFORMED\_EXTRA\_FIELD**: `string`

Warning reason: the extra field data of a record cannot be fully parsed, or one of its fields is ignored: an AES
extra field shorter than 7 bytes, or on a record that is not encrypted and whose compression method is not 99, and
the Zip64 extra field of a local file header that is missing behind the sentinels of the header, too short for
them, or holds a value above `Number.MAX_SAFE_INTEGER`.
The raw bytes stay available in `rawExtraField` (see [ZipReader#warnings](../classes/ZipReader.md#warnings) and [EntryMetaData#warnings](../interfaces/EntryMetaData.md#warnings))
