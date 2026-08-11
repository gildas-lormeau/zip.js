[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnicode

# Interface: EntryExtraFieldUnicode

Defined in: [index.d.ts:1263](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1263)

Represents a Unicode path or comment extra field record of an entry.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1245](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1245)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### type

> **type**: `number`

Defined in: [index.d.ts:1241](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1241)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### valid?

> `optional` **valid?**: `boolean`

Defined in: [index.d.ts:1267](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1267)

`true` if the extra field is consistent with the entry metadata.
