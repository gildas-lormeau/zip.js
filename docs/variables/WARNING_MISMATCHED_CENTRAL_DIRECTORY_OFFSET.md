[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WARNING\_MISMATCHED\_CENTRAL\_DIRECTORY\_OFFSET

# Variable: WARNING\_MISMATCHED\_CENTRAL\_DIRECTORY\_OFFSET

> `const` **WARNING\_MISMATCHED\_CENTRAL\_DIRECTORY\_OFFSET**: `string`

Warning reason: the end of central directory record stores a central directory offset that does not point at
the central directory actually found before it, so the archive was read from the directory found rather than
from the stored offset (see [ZipReader#warnings](../classes/ZipReader.md#warnings)); the reason of [ERR\_AMBIGUOUS\_ARCHIVE](ERR_AMBIGUOUS_ARCHIVE.md) under
`strictness: "strict"`

## Remarks

Such an archive is typically one written with absolute offsets for a prefix that is no longer there, e.g. a
self-extracting archive whose stub was removed, or one whose end of central directory record was damaged.
When the local file header of the first entry is found at the same shifted position only, the entries are
read from the shifted positions; otherwise the offsets stored in the central directory are used as they are.
A stored offset short of the directory whose entries are found at the shifted positions is diagnosed as
[WARNING\_PREPENDED\_DATA](WARNING_PREPENDED_DATA.md) instead.
