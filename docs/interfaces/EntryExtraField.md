[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraField

# Interface: EntryExtraField

Defined in: [index.d.ts:1428](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L1428)

Represents an extra field record of an entry.

## Extended by

- [`EntryExtraFieldAES`](EntryExtraFieldAES.md)
- [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)
- [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1436](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L1436)

The data of the extra field.

***

### type

> **type**: `number`

Defined in: [index.d.ts:1432](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L1432)

The type (header id) of the extra field.
