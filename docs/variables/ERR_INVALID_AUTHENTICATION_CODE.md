[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_AUTHENTICATION\_CODE

# Variable: ERR\_INVALID\_AUTHENTICATION\_CODE

> `const` **ERR\_INVALID\_AUTHENTICATION\_CODE**: `string`

Defined in: [index.d.ts:3056](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L3056)

Invalid authentication code error, thrown when the authentication code of an entry encrypted with AES does not
match the encrypted data, e.g. when the data was tampered or corrupted after the encryption.

## Remarks

This constant and [ERR\_INVALID\_CRC32](ERR_INVALID_CRC32.md) share the same value as [ERR\_INVALID\_SIGNATURE](ERR_INVALID_SIGNATURE.md) for backward
compatibility. They will become distinct strings in the next minor version.
