[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryBitFlag

# Interface: EntryBitFlag

Defined in: [index.d.ts:1448](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1448)

Represents the parsed general purpose bit flag of an entry.

## Properties

### dataDescriptor

> **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1456](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1456)

`true` if the entry data is followed by a data descriptor.

***

### languageEncodingFlag

> **languageEncodingFlag**: `boolean`

Defined in: [index.d.ts:1460](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1460)

`true` if the filename and the comment are encoded in UTF-8 (EFS).

***

### level

> **level**: `number`

Defined in: [index.d.ts:1452](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1452)

The compression option bits.
