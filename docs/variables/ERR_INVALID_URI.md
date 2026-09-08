[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_URI

# Variable: ERR\_INVALID\_URI

> `const` **ERR\_INVALID\_URI**: `string`

Invalid URI error

## Remarks

Thrown by [configure](../functions/configure.md) when [Configuration#workerURI](../interfaces/Configuration.md#workeruri) or [Configuration#wasmURI](../interfaces/Configuration.md#wasmuri) is neither falsy, a string,
nor a function. A function is not called at that point, so what it returns is not validated here: one returning something
other than a string fails later and quietly, when loading the worker throws and the codecs fall back to the main thread.
A falsy value keeps meaning "no worker" and "no WebAssembly module", which is how the
entry points excluding them unset their URI.
