[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryBitFlag

# Interface: EntryBitFlag

Defined in: [index.d.ts:1411](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L1411)

Represents the parsed general purpose bit flag of an entry.

## Properties

### dataDescriptor

> **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1419](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L1419)

`true` if the entry data is followed by a data descriptor.

***

### languageEncodingFlag

> **languageEncodingFlag**: `boolean`

Defined in: [index.d.ts:1423](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L1423)

`true` if the filename and the comment are encoded in UTF-8 (EFS).

***

### level

> **level**: `number`

Defined in: [index.d.ts:1415](https://github.com/gildas-lormeau/zip.js/blob/6edab2a8c9668fd8462c20e69bc657763354a004/index.d.ts#L1415)

The compression option bits.
