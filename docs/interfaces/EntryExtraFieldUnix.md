[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnix

# Interface: EntryExtraFieldUnix

Represents a Unix extra field record storing ownership: the Info-ZIP "new" Unix extra field (0x7875), read
into [EntryMetaData#extraFieldInfoZip](EntryMetaData.md#extrafieldinfozip), or the Info-ZIP "old" Unix extra field (0x7855), read into
[EntryMetaData#extraFieldUnix](EntryMetaData.md#extrafieldunix).

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

### type

> **type**: `number`

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### uid?

> `optional` **uid?**: `number`

The Unix user id.

***

### version?

> `optional` **version?**: `number`

The version of the extra field, only defined for the Info-ZIP "new" Unix extra field (0x7875).
