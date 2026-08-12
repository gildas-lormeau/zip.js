[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_AMBIGUOUS\_ARCHIVE

# Variable: ERR\_AMBIGUOUS\_ARCHIVE

> `const` **ERR\_AMBIGUOUS\_ARCHIVE**: `string`

Defined in: [index.d.ts:3018](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L3018)

Ambiguous archive error

## Remarks

The thrown error carries a `reason` property describing the ambiguity: `"appended data"`, `"prepended data"`, `"trailing central directory data"`, `"mismatched zip64 end of central directory record"`, or `"duplicate filename"`.
