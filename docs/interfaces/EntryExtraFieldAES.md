[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldAES

# Interface: EntryExtraFieldAES

Represents the AES extra field record of an entry.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### originalCompressionMethod?

> `optional` **originalCompressionMethod?**: `number`

The compression method stored in the AES extra field.

***

### strength?

> `optional` **strength?**: `number`

The encryption strength (1, 2 or 3).

***

### type

> **type**: `number`

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### vendorId?

> `optional` **vendorId?**: `number`

The vendor identifier.

***

### vendorVersion?

> `optional` **vendorVersion?**: `number`

The vendor version (1 for AE-1, 2 for AE-2). Entries in AE-1 format store the CRC-32 checksum of the content,
entries in AE-2 format store a zeroed value.
