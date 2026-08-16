[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNSAFE\_FILENAME

# Variable: ERR\_UNSAFE\_FILENAME

> `const` **ERR\_UNSAFE\_FILENAME**: `string`

Defined in: [index.d.ts:3465](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L3465)

Unsafe filename error

## Remarks

Thrown when reading an archive containing an entry whose filename is rejected by
[GetEntriesOptions#filenameValidation](../interfaces/GetEntriesOptions.md#filenamevalidation). The thrown error carries the offending name in its `filename`
property.
