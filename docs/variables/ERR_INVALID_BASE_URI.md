[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_INVALID\_BASE\_URI

# Variable: ERR\_INVALID\_BASE\_URI

> `const` **ERR\_INVALID\_BASE\_URI**: `string`

Invalid baseURI error

## Remarks

Thrown by [configure](../functions/configure.md) when [Configuration#baseURI](../interfaces/Configuration.md#baseuri) is neither falsy nor a string. A `URL` object used to be
accepted here, because `new URL(uri, baseURI)` stringifies its base, and then failed much later with a `DataCloneError`
the first time a web worker ran, since the base URL is posted to it. Unlike [Configuration#workerURI](../interfaces/Configuration.md#workeruri) and
[Configuration#wasmURI](../interfaces/Configuration.md#wasmuri), it cannot be a function: it is resolved before any URI is.
