[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldAES

# Interface: EntryExtraFieldAES

Represents the AES extra field record of an entry.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### compressionMethod?

> `optional` **compressionMethod?**: `number`

The real compression method of the entry, stored in the AES extra field because the header carries `99`
instead. This is the value reported by [EntryMetaData#compressionMethod](EntryMetaData.md#compressionmethod).

***

### data

> **data**: `Uint8Array`

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### originalCompressionMethod?

> `optional` **originalCompressionMethod?**: `number`

The compression method stored in the header of the entry, i.e. `99` for a WinZip AES entry.

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
