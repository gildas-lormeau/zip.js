[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNSUPPORTED\_UINT64

# Variable: ERR\_UNSUPPORTED\_UINT64

> `const` **ERR\_UNSUPPORTED\_UINT64**: `string`

Unsupported 64-bit value error

## Remarks

Thrown when a 64-bit size, offset, or entry count read from a zip file exceeds `Number.MAX_SAFE_INTEGER`,
instead of processing the value with a loss of precision.
