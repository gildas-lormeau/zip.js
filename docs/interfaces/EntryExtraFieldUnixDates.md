[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnixDates

# Interface: EntryExtraFieldUnixDates

Represents a Unix extra field record storing timestamps: the Info-ZIP Unix type 1 extra field (0x5855),
written notably by macOS Archive Utility and `ditto`, or the PKWARE Unix extra field (0x000d). Both store
the last access/modification dates as 32-bit Unix times, followed by the optional uid/gid in the local
file header.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### gid?

> `optional` **gid?**: `number`

The Unix group id.

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

The last access date.

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

The last modification date.

***

### type

> **type**: `number`

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### uid?

> `optional` **uid?**: `number`

The Unix user id.
