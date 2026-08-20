[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_SIGNAL

# Variable: ERR\_INVALID\_SIGNAL

> `const` **ERR\_INVALID\_SIGNAL**: `string`

Invalid signal error

## Remarks

Thrown when the `signal` option is not an `AbortSignal`. Any object exposing `addEventListener()` and a boolean `aborted`
property is accepted, so a signal coming from another realm keeps working.
