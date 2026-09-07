[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_URI

# Variable: ERR\_INVALID\_URI

> `const` **ERR\_INVALID\_URI**: `string`

Invalid URI error

## Remarks

Thrown by [configure](../functions/configure.md) when [Configuration#workerURI](../interfaces/Configuration.md#workeruri) or [Configuration#wasmURI](../interfaces/Configuration.md#wasmuri) is neither falsy, a string,
nor a function returning a string. A falsy value keeps meaning "no worker" and "no WebAssembly module", which is how the
entry points excluding them unset their URI.
