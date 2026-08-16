[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_PASSWORD\_TYPE

# Variable: ERR\_INVALID\_PASSWORD\_TYPE

> `const` **ERR\_INVALID\_PASSWORD\_TYPE**: `string`

Defined in: [index.d.ts:3540](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L3540)

Invalid password error (thrown when the `password` option is not a string, or the `rawPassword` option is not a `Uint8Array`)

## Remarks

A value of another type would silently produce an unencrypted archive, and a `rawPassword` passed as a string
would produce an archive that cannot be opened with the equivalent [ZipWriterConstructorOptions#password](../interfaces/ZipWriterConstructorOptions.md#password).
