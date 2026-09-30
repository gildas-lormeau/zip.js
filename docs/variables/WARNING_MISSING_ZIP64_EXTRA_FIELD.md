[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_MISSING\_ZIP64\_EXTRA\_FIELD

# Variable: WARNING\_MISSING\_ZIP64\_EXTRA\_FIELD

> `const` **WARNING\_MISSING\_ZIP64\_EXTRA\_FIELD**: `string`

Warning reason: a central directory record holds the Zip64 sentinel in a size, offset or disk number field
but carries no Zip64 extra field resolving it (see [ZipReader#warnings](../classes/ZipReader.md#warnings)). The entry is listed, its
sizes and offset are unusable, and reading its data or copying it with [ZipWriter#appendZip](../classes/ZipWriter.md#appendzip) throws
[ERR\_EXTRAFIELD\_ZIP64\_NOT\_FOUND](ERR_EXTRAFIELD_ZIP64_NOT_FOUND.md); the other entries are unaffected. Under `strictness: "strict"`,
[ZipReader#getEntries](../classes/ZipReader.md#getentries) throws [ERR\_EXTRAFIELD\_ZIP64\_NOT\_FOUND](ERR_EXTRAFIELD_ZIP64_NOT_FOUND.md) instead.
