[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / initShimAsyncCodec

# Function: initShimAsyncCodec()

> **initShimAsyncCodec**(`library`, `constructorOptions`, `registerDataHandler`): [`ZipLibrary`](../interfaces/ZipLibrary.md)

Defined in: [index.d.ts:154](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L154)

Transforms event-based third-party codec implementations into implementations compatible with zip.js

## Parameters

### library

[`EventBasedZipLibrary`](../interfaces/EventBasedZipLibrary.md)

The third-party codec implementations.

### constructorOptions

`unknown`

The options passed to the third-party implementations when building instances.

### registerDataHandler

[`registerDataHandler`](../interfaces/registerDataHandler.md)

The function called to handle the `data` events triggered by a third-party codec implementation.

## Returns

[`ZipLibrary`](../interfaces/ZipLibrary.md)

An instance containing classes compatible with [ZipDeflate](../classes/ZipDeflate.md) and [ZipInflate](../classes/ZipInflate.md).
