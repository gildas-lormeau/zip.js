[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_AUTHENTICATION\_CODE

# Variable: ERR\_INVALID\_AUTHENTICATION\_CODE

> `const` **ERR\_INVALID\_AUTHENTICATION\_CODE**: `string`

Defined in: [index.d.ts:3146](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L3146)

Invalid authentication code error, thrown when the authentication code of an entry encrypted with AES does not
match the encrypted data, e.g. when the data was tampered or corrupted after the encryption.

## Remarks

This constant and [ERR\_INVALID\_CRC32](ERR_INVALID_CRC32.md) share the same value as [ERR\_INVALID\_SIGNATURE](ERR_INVALID_SIGNATURE.md) for backward
compatibility. They will become distinct strings in the next minor version.
