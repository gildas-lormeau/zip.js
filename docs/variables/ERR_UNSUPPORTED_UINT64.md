[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNSUPPORTED\_UINT64

# Variable: ERR\_UNSUPPORTED\_UINT64

> `const` **ERR\_UNSUPPORTED\_UINT64**: `string`

Unsupported 64-bit value error

## Remarks

Thrown when a 64-bit size, offset, or entry count read from a zip file exceeds `Number.MAX_SAFE_INTEGER`,
instead of processing the value with a loss of precision. A local file header whose Zip64 extra field holds such a
value is not rejected, since the sizes of an entry are read from the central directory: the field is reported as
[WARNING\_MALFORMED\_EXTRA\_FIELD](WARNING_MALFORMED_EXTRA_FIELD.md) instead, see [ERR\_EXTRAFIELD\_ZIP64\_NOT\_FOUND](ERR_EXTRAFIELD_ZIP64_NOT_FOUND.md).
