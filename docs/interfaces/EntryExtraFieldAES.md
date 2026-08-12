[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldAES

# Interface: EntryExtraFieldAES

Defined in: [index.d.ts:1259](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1259)

Represents the AES extra field record of an entry.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1254](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1254)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### originalCompressionMethod?

> `optional` **originalCompressionMethod?**: `number`

Defined in: [index.d.ts:1267](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1267)

The compression method stored in the AES extra field.

***

### strength?

> `optional` **strength?**: `number`

Defined in: [index.d.ts:1263](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1263)

The encryption strength (1, 2 or 3).

***

### type

> **type**: `number`

Defined in: [index.d.ts:1250](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1250)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)
