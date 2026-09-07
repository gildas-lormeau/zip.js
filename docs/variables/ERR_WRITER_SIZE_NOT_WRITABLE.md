[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_WRITER\_SIZE\_NOT\_WRITABLE

# Variable: ERR\_WRITER\_SIZE\_NOT\_WRITABLE

> `const` **ERR\_WRITER\_SIZE\_NOT\_WRITABLE**: `string`

Invalid writer size error

## Remarks

Thrown when [WritableWriter#size](../interfaces/WritableWriter.md#size) cannot be assigned, e.g. when it is a getter with no setter, a read-only
property or a frozen object. zip.js writes the number of bytes written into that property, so a writer refusing the
assignment used to fail with a bare `TypeError` from the engine, and only once the first entry had been written.
