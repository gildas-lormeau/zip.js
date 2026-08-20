[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_AMBIGUOUS\_ARCHIVE

# Variable: ERR\_AMBIGUOUS\_ARCHIVE

> `const` **ERR\_AMBIGUOUS\_ARCHIVE**: `string`

Ambiguous archive error

## Remarks

The thrown error carries a `reason` property describing the ambiguity: `"appended data"`,
`"prepended data"`, `"trailing central directory data"`, `"multiple end of central directory records"`,
`"mismatched zip64 end of central directory record"`, `"duplicate filename"`, or, when
GetEntriesOptions#checkLocalDirectory compares the local header of an entry with its central
directory record, `"mismatched local file header (filename)"`,
`"mismatched local file header (general purpose bit flag)"`,
`"mismatched local file header (compression method)"` or
`"mismatched local file header (crc32 or sizes)"`.
