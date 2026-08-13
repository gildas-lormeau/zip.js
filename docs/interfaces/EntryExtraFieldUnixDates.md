[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnixDates

# Interface: EntryExtraFieldUnixDates

Defined in: [index.d.ts:1466](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1466)

Represents a Unix extra field record storing timestamps: the Info-ZIP Unix type 1 extra field (0x5855),
written notably by macOS Archive Utility and `ditto`, or the PKWARE Unix extra field (0x000d). Both store
the last access/modification dates as 32-bit Unix times, followed by the optional uid/gid in the local
file header.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1436](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1436)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1482](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1482)

The Unix group id.

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1470](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1470)

The last access date.

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

Defined in: [index.d.ts:1474](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1474)

The last modification date.

***

### type

> **type**: `number`

Defined in: [index.d.ts:1432](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1432)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:1478](https://github.com/gildas-lormeau/zip.js/blob/c9b73330dec29c733bb7a9d2dfdbb62bcd048550/index.d.ts#L1478)

The Unix user id.
