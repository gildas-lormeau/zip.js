[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnixDates

# Interface: EntryExtraFieldUnixDates

Defined in: [index.d.ts:1391](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1391)

Represents a Unix extra field record storing timestamps: the Info-ZIP Unix type 1 extra field (0x5855),
written notably by macOS Archive Utility and `ditto`, or the PKWARE Unix extra field (0x000d). Both store
the last access/modification dates as 32-bit Unix times, followed by the optional uid/gid in the local
file header.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1361](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1361)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1407](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1407)

The Unix group id.

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1395](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1395)

The last access date.

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

Defined in: [index.d.ts:1399](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1399)

The last modification date.

***

### type

> **type**: `number`

Defined in: [index.d.ts:1357](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1357)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:1403](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1403)

The Unix user id.
