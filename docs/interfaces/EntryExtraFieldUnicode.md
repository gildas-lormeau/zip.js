[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnicode

# Interface: EntryExtraFieldUnicode

Represents a Unicode path or comment extra field record of an entry.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### comment?

> `optional` **comment?**: `string`

The comment stored in the extra field, when it is a Unicode comment extra field (0x6375).

***

### data

> **data**: `Uint8Array`

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### filename?

> `optional` **filename?**: `string`

The filename stored in the extra field, when it is a Unicode path extra field (0x7075).

***

### type

> **type**: `number`

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### valid?

> `optional` **valid?**: `boolean`

`true` if the extra field is consistent with the entry metadata.

***

### version?

> `optional` **version?**: `number`

The version of the extra field.
