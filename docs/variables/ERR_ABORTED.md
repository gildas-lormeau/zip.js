[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ERR\_ABORTED

# Variable: ERR\_ABORTED

> `const` **ERR\_ABORTED**: `string`

Defined in: [index.d.ts:3549](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L3549)

Aborted operation error (thrown by [ZipDirectoryEntry#exportFileSystemHandle](../classes/ZipDirectoryEntry.md#exportfilesystemhandle) when it is aborted via
[ZipReaderOptions#signal](../interfaces/ZipReaderOptions.md#signal) on platforms which do not support the `reason` argument of
`AbortController#abort()`)

## Remarks

The reason passed by the caller is discarded by these platforms and cannot be recovered, so a
`DOMException` named `AbortError` carrying this message is thrown in its place.
