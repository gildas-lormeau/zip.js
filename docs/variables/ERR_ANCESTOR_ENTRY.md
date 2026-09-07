[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_ANCESTOR\_ENTRY

# Variable: ERR\_ANCESTOR\_ENTRY

> `const` **ERR\_ANCESTOR\_ENTRY**: `string`

Ancestor entry error (thrown by [ZipFS#move](../classes/ZipFS.md#move) and [ZipEntry#rename](../classes/ZipEntry.md#rename) when the destination is the
moved entry itself or one of its descendants, which would detach the moved subtree from the tree)
