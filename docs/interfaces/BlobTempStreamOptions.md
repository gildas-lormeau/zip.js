[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobTempStreamOptions

# Interface: BlobTempStreamOptions

Defined in: [index.d.ts:553](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L553)

Options for [createBlobTempStream](../functions/createBlobTempStream.md).

## Properties

### thresholdBytes?

> `optional` **thresholdBytes?**: `number`

Defined in: [index.d.ts:559](https://github.com/gildas-lormeau/zip.js/blob/6dfcc8d971710e93f48cd97e36cb8ac26540a99a/index.d.ts#L559)

Spill a buffered entry to a `Blob` once its buffered data exceeds this size, in bytes. Smaller entries stay in memory.

#### Default Value

```ts
1048576
```
