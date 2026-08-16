[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / LocalDirectory

# Interface: LocalDirectory

Represents the local file header fields of an entry, read when getting the entry data.

## Properties

### bitFlag

> **bitFlag**: [`EntryBitFlag`](EntryBitFlag.md)

The general purpose bit flag.

***

### compressedSize?

> `optional` **compressedSize?**: `number`

The compressed size of the content.

***

### compressionMethod?

> `optional` **compressionMethod?**: `number`

The compression method.

***

### crc32?

> `optional` **crc32?**: `number`

The CRC-32 checksum of the content.

***

### encrypted

> **encrypted**: `boolean`

`true` if the entry is encrypted.

***

### extraField?

> `optional` **extraField?**: `Map`\<`number`, [`EntryExtraField`](EntryExtraField.md)\>

The extra field.

***

### extraFieldAES?

> `optional` **extraFieldAES?**: [`EntryExtraFieldAES`](EntryExtraFieldAES.md)

The AES extra field.

***

### extraFieldExtendedTimestamp?

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraField`](EntryExtraField.md)

The extended timestamp extra field.

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraField`](EntryExtraField.md)

The Info-ZIP Unix extra field.

***

### extraFieldLength

> **extraFieldLength**: `number`

The length of the extra field in bytes.

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraField`](EntryExtraField.md)

The NTFS extra field.

***

### extraFieldPkwareUnix?

> `optional` **extraFieldPkwareUnix?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

The PKWARE Unix extra field (0x000d).

***

### extraFieldUnicodeComment?

> `optional` **extraFieldUnicodeComment?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

The Unicode comment extra field.

***

### extraFieldUnicodePath?

> `optional` **extraFieldUnicodePath?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

The Unicode path extra field.

***

### extraFieldUnix?

> `optional` **extraFieldUnix?**: [`EntryExtraField`](EntryExtraField.md)

The Unix extra field.

***

### extraFieldUnixType1?

> `optional` **extraFieldUnixType1?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

The Info-ZIP Unix type 1 extra field (0x5855).

***

### extraFieldUSDZ?

> `optional` **extraFieldUSDZ?**: [`EntryExtraField`](EntryExtraField.md)

The USDZ extra field.

***

### extraFieldZip64?

> `optional` **extraFieldZip64?**: [`EntryExtraField`](EntryExtraField.md)

The Zip64 extra field.

***

### filenameLength

> **filenameLength**: `number`

The length of the filename in bytes.

***

### lastModDate

> **lastModDate**: `Date`

The last modification date.

***

### rawBitFlag

> **rawBitFlag**: `number`

The general purpose bit flag (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

The extra field (raw).

***

### rawLastModDate

> **rawLastModDate**: `number`

The last modification date (raw).

***

### ~~signature?~~

> `optional` **signature?**: `number`

The signature (CRC32 checksum) of the content.

#### Deprecated

Use [LocalDirectory#crc32](#crc32) instead.

***

### uncompressedSize?

> `optional` **uncompressedSize?**: `number`

The uncompressed size of the content.

***

### version

> **version**: `number`

The "Version" field.
