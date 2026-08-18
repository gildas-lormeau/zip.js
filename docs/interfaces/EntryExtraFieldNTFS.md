[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldNTFS

# Interface: EntryExtraFieldNTFS

Represents the NTFS extra field record of an entry (0x000a), storing the dates as Windows `FILETIME` values.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### creationDate?

> `optional` **creationDate?**: `Date`

The creation date.

***

### data

> **data**: `Uint8Array`

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

The last access date.

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

The last modification date.

***

### rawCreationDate?

> `optional` **rawCreationDate?**: `bigint`

The creation date (raw), as a Windows `FILETIME` value.

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate?**: `bigint`

The last access date (raw), as a Windows `FILETIME` value.

***

### rawLastModDate?

> `optional` **rawLastModDate?**: `bigint`

The last modification date (raw), as a Windows `FILETIME` value.

***

### type

> **type**: `number`

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)
