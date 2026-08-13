[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_AMBIGUOUS\_ARCHIVE

# Variable: ERR\_AMBIGUOUS\_ARCHIVE

> `const` **ERR\_AMBIGUOUS\_ARCHIVE**: `string`

Defined in: [index.d.ts:3317](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L3317)

Ambiguous archive error

## Remarks

The thrown error carries a `reason` property describing the ambiguity: `"appended data"`, `"prepended data"`, `"trailing central directory data"`, `"mismatched zip64 end of central directory record"`, or `"duplicate filename"`.
