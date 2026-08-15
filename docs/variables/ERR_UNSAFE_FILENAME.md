[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNSAFE\_FILENAME

# Variable: ERR\_UNSAFE\_FILENAME

> `const` **ERR\_UNSAFE\_FILENAME**: `string`

Defined in: [index.d.ts:3457](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L3457)

Unsafe filename error

## Remarks

Thrown when reading an archive containing an entry whose filename is rejected by
[GetEntriesOptions#filenameValidation](../interfaces/GetEntriesOptions.md#filenamevalidation). The thrown error carries the offending name in its `filename`
property.
