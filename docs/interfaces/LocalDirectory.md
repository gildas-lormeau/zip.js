[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / LocalDirectory

# Interface: LocalDirectory

Defined in: [index.d.ts:1281](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1281)

Represents the local file header fields of an entry, read when getting the entry data.

## Properties

### bitFlag

> **bitFlag**: [`EntryBitFlag`](EntryBitFlag.md)

Defined in: [index.d.ts:1297](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1297)

The general purpose bit flag.

***

### compressedSize?

> `optional` **compressedSize?**: `number`

Defined in: [index.d.ts:1329](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1329)

The compressed size of the content.

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

Defined in: [index.d.ts:1337](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1337)

The compression method.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1289](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1289)

`true` if the entry is encrypted.

***

### extraField?

> `optional` **extraField?**: `Map`\<`number`, [`EntryExtraField`](EntryExtraField.md)\>

Defined in: [index.d.ts:1321](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1321)

The extra field.

***

### extraFieldAES?

> `optional` **extraFieldAES?**: [`EntryExtraFieldAES`](EntryExtraFieldAES.md)

Defined in: [index.d.ts:1345](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1345)

The AES extra field.

***

### extraFieldExtendedTimestamp?

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1361](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1361)

The extended timestamp extra field.

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1357](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1357)

The Info-ZIP Unix extra field.

***

### extraFieldLength

> **extraFieldLength**: `number`

Defined in: [index.d.ts:1313](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1313)

The length of the extra field in bytes.

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1349](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1349)

The NTFS extra field.

***

### extraFieldUnicodeComment?

> `optional` **extraFieldUnicodeComment?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1369](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1369)

The Unicode comment extra field.

***

### extraFieldUnicodePath?

> `optional` **extraFieldUnicodePath?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1365](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1365)

The Unicode path extra field.

***

### extraFieldUnix?

> `optional` **extraFieldUnix?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1353](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1353)

The Unix extra field.

***

### extraFieldUSDZ?

> `optional` **extraFieldUSDZ?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1373](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1373)

The USDZ extra field.

***

### extraFieldZip64?

> `optional` **extraFieldZip64?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1341](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1341)

The Zip64 extra field.

***

### filenameLength

> **filenameLength**: `number`

Defined in: [index.d.ts:1309](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1309)

The length of the filename in bytes.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1305](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1305)

The last modification date.

***

### rawBitFlag

> **rawBitFlag**: `number`

Defined in: [index.d.ts:1293](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1293)

The general purpose bit flag (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1317](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1317)

The extra field (raw).

***

### rawLastModDate

> **rawLastModDate**: `number`

Defined in: [index.d.ts:1301](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1301)

The last modification date (raw).

***

### signature?

> `optional` **signature?**: `number`

Defined in: [index.d.ts:1325](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1325)

The signature (CRC32 checksum) of the content.

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

Defined in: [index.d.ts:1333](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1333)

The uncompressed size of the content.

***

### version

> **version**: `number`

Defined in: [index.d.ts:1285](https://github.com/gildas-lormeau/zip.js/blob/ed2aed2fed9ac402701aab88c670bc3e703b1425/index.d.ts#L1285)

The "Version" field.
