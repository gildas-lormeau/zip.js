[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryBitFlag

# Interface: EntryBitFlag

Defined in: [index.d.ts:1229](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L1229)

Represents the parsed general purpose bit flag of an entry.

## Properties

### dataDescriptor

> **dataDescriptor**: `boolean`

Defined in: [index.d.ts:1237](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L1237)

`true` if the entry data is followed by a data descriptor.

***

### languageEncodingFlag

> **languageEncodingFlag**: `boolean`

Defined in: [index.d.ts:1241](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L1241)

`true` if the filename and the comment are encoded in UTF-8 (EFS).

***

### level

> **level**: `number`

Defined in: [index.d.ts:1233](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L1233)

The compression option bits.
