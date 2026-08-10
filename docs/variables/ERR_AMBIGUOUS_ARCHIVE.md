[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_AMBIGUOUS\_ARCHIVE

# Variable: ERR\_AMBIGUOUS\_ARCHIVE

> `const` **ERR\_AMBIGUOUS\_ARCHIVE**: `string`

Defined in: [index.d.ts:2996](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L2996)

Ambiguous archive error

## Remarks

The thrown error carries a `reason` property describing the ambiguity: `"appended data"`, `"prepended data"`, `"trailing central directory data"`, `"mismatched zip64 end of central directory record"`, or `"duplicate filename"`.
