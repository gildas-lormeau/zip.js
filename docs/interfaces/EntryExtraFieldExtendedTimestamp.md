[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldExtendedTimestamp

# Interface: EntryExtraFieldExtendedTimestamp

Represents the extended timestamp extra field record of an entry (0x5455), storing the dates as 32-bit Unix
times. The central directory record only carries the last modification date, the local file header carries
the dates selected by the flags of the extra field.

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

> `optional` **rawCreationDate?**: `number`

The creation date (raw), as a 32-bit Unix time.

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate?**: `number`

The last access date (raw), as a 32-bit Unix time.

***

### rawLastModDate?

> `optional` **rawLastModDate?**: `number`

The last modification date (raw), as a 32-bit Unix time.

***

### type

> **type**: `number`

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)
