[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryBitFlag

# Interface: EntryBitFlag

Defined in: [index.d.ts:1336](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1336)

Represents the parsed general purpose bit flag of an entry.

## Properties

### dataDescriptor

> **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1344](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1344)

`true` if the entry data is followed by a data descriptor.

***

### languageEncodingFlag

> **languageEncodingFlag**: `boolean`

Defined in: [index.d.ts:1348](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1348)

`true` if the filename and the comment are encoded in UTF-8 (EFS).

***

### level

> **level**: `number`

Defined in: [index.d.ts:1340](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1340)

The compression option bits.
