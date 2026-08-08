[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_AMBIGUOUS\_ARCHIVE

# Variable: ERR\_AMBIGUOUS\_ARCHIVE

> `const` **ERR\_AMBIGUOUS\_ARCHIVE**: `string`

Defined in: [index.d.ts:2886](https://github.com/gildas-lormeau/zip.js/blob/747cb1893fc85594e9e97cc23afe3497dc9b1888/index.d.ts#L2886)

Ambiguous archive error

## Remarks

The thrown error carries a `reason` property describing the ambiguity: `"appended data"`, `"prepended data"`, `"trailing central directory data"`, `"mismatched zip64 end of central directory record"`, or `"duplicate filename"`.
