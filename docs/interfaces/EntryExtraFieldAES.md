[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldAES

# Interface: EntryExtraFieldAES

Defined in: [index.d.ts:1250](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1250)

Represents the AES extra field record of an entry.

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

### originalCompressionMethod?

> `optional` **originalCompressionMethod?**: `number`

Defined in: [index.d.ts:1258](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1258)

The compression method stored in the AES extra field.

***

### strength?

> `optional` **strength?**: `number`

Defined in: [index.d.ts:1254](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1254)

The encryption strength (1, 2 or 3).

***

### type

> **type**: `number`

Defined in: [index.d.ts:1241](https://github.com/gildas-lormeau/zip.js/blob/baaddb7e6aba37205dc795434806b5fab87a2090/index.d.ts#L1241)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)
