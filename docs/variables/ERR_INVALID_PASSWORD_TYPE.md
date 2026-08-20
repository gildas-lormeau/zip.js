[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_PASSWORD\_TYPE

# Variable: ERR\_INVALID\_PASSWORD\_TYPE

> `const` **ERR\_INVALID\_PASSWORD\_TYPE**: `string`

Invalid password error (thrown when the `password` option is not a string, or the `rawPassword` option is not a `Uint8Array`)

## Remarks

A value of another type would silently produce an unencrypted archive, and a `rawPassword` passed as a string
would produce an archive that cannot be opened with the equivalent [ZipWriterConstructorOptions#password](../interfaces/ZipWriterConstructorOptions.md#password). The
reader applies the same check, where a value of another type used to fail with the unrelated [ERR\_ENCRYPTED](ERR_ENCRYPTED.md) or
[ERR\_INVALID\_PASSWORD](ERR_INVALID_PASSWORD.md).
