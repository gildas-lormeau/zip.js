[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnixDates

# Interface: EntryExtraFieldUnixDates

Defined in: [index.d.ts:1505](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1505)

Represents a Unix extra field record storing timestamps: the Info-ZIP Unix type 1 extra field (0x5855),
written notably by macOS Archive Utility and `ditto`, or the PKWARE Unix extra field (0x000d). Both store
the last access/modification dates as 32-bit Unix times, followed by the optional uid/gid in the local
file header.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1475](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1475)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1521](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1521)

The Unix group id.

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1509](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1509)

The last access date.

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

Defined in: [index.d.ts:1513](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1513)

The last modification date.

***

### type

> **type**: `number`

Defined in: [index.d.ts:1471](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1471)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:1517](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1517)

The Unix user id.
