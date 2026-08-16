[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_UNSAFE\_FILENAME

# Variable: ERR\_UNSAFE\_FILENAME

> `const` **ERR\_UNSAFE\_FILENAME**: `string`

Unsafe filename error

## Remarks

Thrown when reading an archive containing an entry whose filename is rejected by
[GetEntriesOptions#filenameValidation](../interfaces/GetEntriesOptions.md#filenamevalidation). The thrown error carries the offending name in its `filename`
property.
