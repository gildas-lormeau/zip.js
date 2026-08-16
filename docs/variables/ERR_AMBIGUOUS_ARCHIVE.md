[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_AMBIGUOUS\_ARCHIVE

# Variable: ERR\_AMBIGUOUS\_ARCHIVE

> `const` **ERR\_AMBIGUOUS\_ARCHIVE**: `string`

Defined in: [index.d.ts:3450](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L3450)

Ambiguous archive error

## Remarks

The thrown error carries a `reason` property describing the ambiguity: `"appended data"`, `"prepended data"`, `"trailing central directory data"`, `"mismatched zip64 end of central directory record"`, or `"duplicate filename"`.
