[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraFieldUnixDates

# Interface: EntryExtraFieldUnixDates

Defined in: [index.d.ts:1503](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1503)

Represents a Unix extra field record storing timestamps: the Info-ZIP Unix type 1 extra field (0x5855),
written notably by macOS Archive Utility and `ditto`, or the PKWARE Unix extra field (0x000d). Both store
the last access/modification dates as 32-bit Unix times, followed by the optional uid/gid in the local
file header.

## Extends

- [`EntryExtraField`](EntryExtraField.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1473](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1473)

The data of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`data`](EntryExtraField.md#data)

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1519](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1519)

The Unix group id.

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1507](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1507)

The last access date.

***

### lastModDate?

> `optional` **lastModDate?**: `Date`

Defined in: [index.d.ts:1511](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1511)

The last modification date.

***

### type

> **type**: `number`

Defined in: [index.d.ts:1469](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1469)

The type (header id) of the extra field.

#### Inherited from

[`EntryExtraField`](EntryExtraField.md).[`type`](EntryExtraField.md#type)

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:1515](https://github.com/gildas-lormeau/zip.js/blob/f8f317b930b2e41b3184052c0c74fa81382218c7/index.d.ts#L1515)

The Unix user id.
