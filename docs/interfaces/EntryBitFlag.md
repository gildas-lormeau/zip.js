[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryBitFlag

# Interface: EntryBitFlag

Defined in: [index.d.ts:1212](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L1212)

Represents the parsed general purpose bit flag of an entry.

## Properties

### dataDescriptor

> **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1220](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L1220)

`true` if the entry data is followed by a data descriptor.

***

### languageEncodingFlag

> **languageEncodingFlag**: `boolean`

Defined in: [index.d.ts:1224](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L1224)

`true` if the filename and the comment are encoded in UTF-8 (EFS).

***

### level

> **level**: `number`

Defined in: [index.d.ts:1216](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L1216)

The compression option bits.
