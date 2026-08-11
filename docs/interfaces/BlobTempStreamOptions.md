[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobTempStreamOptions

# Interface: BlobTempStreamOptions

Defined in: [index.d.ts:454](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L454)

Options for [createBlobTempStream](../functions/createBlobTempStream.md).

## Properties

### thresholdBytes?

> `optional` **thresholdBytes?**: `number`

Defined in: [index.d.ts:460](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L460)

Spill a buffered entry to a `Blob` once its buffered data exceeds this size, in bytes. Smaller entries stay in memory.

#### Default Value

```ts
1048576
```
