[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldZip64

# Interface: EntryExtraFieldZip64

Represents the Zip64 extra field record of an entry. Each property is only defined when the matching field
of the header was set to its maximum value, i.e. when the real value had to be stored in the extra field.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### compressedSize?

> `optional` **compressedSize?**: `number`

The compressed size of the entry.

***

### data

> **data**: `Uint8Array`

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### diskNumberStart?

> `optional` **diskNumberStart?**: `number`

The number of the disk where the entry data starts.

***

### offset?

> `optional` **offset?**: `number`

The offset of the local file header of the entry.

***

### type

> **type**: `number`

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

The uncompressed size of the entry.
