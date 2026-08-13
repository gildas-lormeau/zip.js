[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnicode

# Interface: EntryExtraFieldUnicode

Defined in: [index.d.ts:1322](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1322)

Represents a Unicode path or comment extra field record of an entry.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1271](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1271)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### type

> **type**: `number`

Defined in: [index.d.ts:1267](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1267)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### valid?

> `optional` **valid?**: `boolean`

Defined in: [index.d.ts:1326](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1326)

`true` if the extra field is consistent with the entry metadata.
