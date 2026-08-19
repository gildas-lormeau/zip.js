[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_ENTRY\_DATA\_OUT\_OF\_BOUNDS

# Variable: ERR\_ENTRY\_DATA\_OUT\_OF\_BOUNDS

> `const` **ERR\_ENTRY\_DATA\_OUT\_OF\_BOUNDS**: `string`

Entry data out of bounds error

## Remarks

Thrown by [FileEntry#getData](../interfaces/FileEntry.md#getdata) when the declared extent of the entry data (i.e. its offset plus its compressed size) ends past the end of the zip file.
