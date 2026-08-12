[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobTempStreamOptions

# Interface: BlobTempStreamOptions

Defined in: [index.d.ts:463](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L463)

Options for [createBlobTempStream](../functions/createBlobTempStream.md).

## Properties

### thresholdBytes?

> `optional` **thresholdBytes?**: `number`

Defined in: [index.d.ts:469](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L469)

Spill a buffered entry to a `Blob` once its buffered data exceeds this size, in bytes. Smaller entries stay in memory.

#### Default Value

```ts
1048576
```
