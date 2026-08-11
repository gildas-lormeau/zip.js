[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnicode

# Interface: EntryExtraFieldUnicode

Defined in: [index.d.ts:1272](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L1272)

Represents a Unicode path or comment extra field record of an entry.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1254](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L1254)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### type

> **type**: `number`

Defined in: [index.d.ts:1250](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L1250)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### valid?

> `optional` **valid?**: `boolean`

Defined in: [index.d.ts:1276](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L1276)

`true` if the extra field is consistent with the entry metadata.
