[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryExtraField

# Interface: EntryExtraField

Defined in: [index.d.ts:1246](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1246)

Represents an extra field record of an entry.

## Extended by

- [`EntryExtraFieldAES`](EntryExtraFieldAES.md)
- [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

## Properties

### data

> **data**: `Uint8Array`

Defined in: [index.d.ts:1254](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1254)

The data of the extra field.

***

### type

> **type**: `number`

Defined in: [index.d.ts:1250](https://github.com/gildas-lormeau/zip.js/blob/145e5bdb1e7cc78e96edfd9a84ad855c74dc6273/index.d.ts#L1250)

The type (header id) of the extra field.
