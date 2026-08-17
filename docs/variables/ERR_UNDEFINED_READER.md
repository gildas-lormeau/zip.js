[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNDEFINED\_READER

# Variable: ERR\_UNDEFINED\_READER

> `const` **ERR\_UNDEFINED\_READER**: `string`

Undefined reader error

## Remarks

Thrown when adding an entry with the [ZipWriterConstructorOptions#passThrough](../interfaces/ZipWriterConstructorOptions.md#passthrough) option set to `true`
and no Reader instance: the headers of such an entry describe its content verbatim and would declare content that
is not there. Directory entries are exempt, they have no content to write as-is.
