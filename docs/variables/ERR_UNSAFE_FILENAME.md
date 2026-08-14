[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNSAFE\_FILENAME

# Variable: ERR\_UNSAFE\_FILENAME

> `const` **ERR\_UNSAFE\_FILENAME**: `string`

Defined in: [index.d.ts:3423](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L3423)

Unsafe filename error

## Remarks

Thrown when reading an archive containing an entry whose filename is rejected by
[GetEntriesOptions#filenameValidation](../interfaces/GetEntriesOptions.md#filenamevalidation). The thrown error carries the offending name in its `filename`
property.
