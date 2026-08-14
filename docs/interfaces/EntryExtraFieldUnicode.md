[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnicode

# Interface: EntryExtraFieldUnicode

Defined in: [index.d.ts:1524](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1524)

Represents a Unicode path or comment extra field record of an entry.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1473](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1473)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### type

> **type**: `number`

Defined in: [index.d.ts:1469](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1469)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### valid?

> `optional` **valid?**: `boolean`

Defined in: [index.d.ts:1528](https://github.com/gildas-lormeau/zip.js/blob/affdaca3185899ef53f0d7f92e81b0ecb16491ca/index.d.ts#L1528)

`true` if the extra field is consistent with the entry metadata.
