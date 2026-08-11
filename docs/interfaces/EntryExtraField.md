[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraField

# Interface: EntryExtraField

Defined in: [index.d.ts:1237](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L1237)

Represents an extra field record of an entry.

## Extended by

- [`EntryExtraFieldAES`](EntryExtraFieldAES.md)
- [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1245](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L1245)

The data of the extra field.

***

### type

> **type**: `number`

Defined in: [index.d.ts:1241](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L1241)

The type (header id) of the extra field.
