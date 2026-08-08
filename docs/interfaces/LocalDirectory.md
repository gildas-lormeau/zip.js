[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / LocalDirectory

# Interface: LocalDirectory

Defined in: [index.d.ts:1202](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1202)

Represents the local file header fields of an entry, read when getting the entry data.

## Properties

### bitFlag

> **bitFlag**: [`EntryBitFlag`](EntryBitFlag.md)

Defined in: [index.d.ts:1218](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1218)

The general purpose bit flag.

***

### compressedSize?

> `optional` **compressedSize?**: `number`

Defined in: [index.d.ts:1250](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1250)

The compressed size of the content.

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

Defined in: [index.d.ts:1258](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1258)

The compression method.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1210](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1210)

`true` if the entry is encrypted.

***

### extraField?

> `optional` **extraField?**: `Map`\<`number`, [`EntryExtraField`](EntryExtraField.md)\>

Defined in: [index.d.ts:1242](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1242)

The extra field.

***

### extraFieldAES?

> `optional` **extraFieldAES?**: [`EntryExtraFieldAES`](EntryExtraFieldAES.md)

Defined in: [index.d.ts:1266](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1266)

The AES extra field.

***

### extraFieldExtendedTimestamp?

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1282](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1282)

The extended timestamp extra field.

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1278](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1278)

The Info-ZIP Unix extra field.

***

### extraFieldLength

> **extraFieldLength**: `number`

Defined in: [index.d.ts:1234](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1234)

The length of the extra field in bytes.

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1270](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1270)

The NTFS extra field.

***

### extraFieldUnicodeComment?

> `optional` **extraFieldUnicodeComment?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1290](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1290)

The Unicode comment extra field.

***

### extraFieldUnicodePath?

> `optional` **extraFieldUnicodePath?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1286](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1286)

The Unicode path extra field.

***

### extraFieldUnix?

> `optional` **extraFieldUnix?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1274](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1274)

The Unix extra field.

***

### extraFieldUSDZ?

> `optional` **extraFieldUSDZ?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1294](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1294)

The USDZ extra field.

***

### extraFieldZip64?

> `optional` **extraFieldZip64?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1262](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1262)

The Zip64 extra field.

***

### filenameLength

> **filenameLength**: `number`

Defined in: [index.d.ts:1230](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1230)

The length of the filename in bytes.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1226](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1226)

The last modification date.

***

### rawBitFlag

> **rawBitFlag**: `number`

Defined in: [index.d.ts:1214](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1214)

The general purpose bit flag (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1238](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1238)

The extra field (raw).

***

### rawLastModDate

> **rawLastModDate**: `number`

Defined in: [index.d.ts:1222](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1222)

The last modification date (raw).

***

### signature?

> `optional` **signature?**: `number`

Defined in: [index.d.ts:1246](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1246)

The signature (CRC32 checksum) of the content.

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

Defined in: [index.d.ts:1254](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1254)

The uncompressed size of the content.

***

### version

> **version**: `number`

Defined in: [index.d.ts:1206](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L1206)

The "Version" field.
