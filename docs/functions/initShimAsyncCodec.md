[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / initShimAsyncCodec

# Function: initShimAsyncCodec()

> **initShimAsyncCodec**(`library`, `constructorOptions`, `registerDataHandler`): [`ZipLibrary`](../interfaces/ZipLibrary.md)

Defined in: [index.d.ts:314](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L314)

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
