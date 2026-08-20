[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNSUPPORTED\_SPLIT\_ZIP

# Variable: ERR\_UNSUPPORTED\_SPLIT\_ZIP

> `const` **ERR\_UNSUPPORTED\_SPLIT\_ZIP**: `string`

Unsupported split zip file error

## Remarks

Thrown by [ZipWriter#prependZip](../classes/ZipWriter.md#prependzip) when the reader is an array, which everywhere else in the API denotes the disks
of a split zip file. Prepending flattens its source into a single output without rewriting the per-disk offsets stored
in the central directory, so a split zip file cannot be prepended. Concatenate the data beforehand to prepend an
archive held as several pieces.
