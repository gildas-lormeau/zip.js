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

### dataDescriptor?

> `optional` **dataDescriptor?**: [`LocalDataDescriptor`](LocalDataDescriptor.md)

The data descriptor record written after the content, when the entry has one.

Only defined when the record has been read, i.e. when the [ZipReaderOptions#checkOverlappingEntry](ZipReaderOptions.md#checkoverlappingentry) or
the [ZipReaderOptions#checkOverlappingEntryOnly](ZipReaderOptions.md#checkoverlappingentryonly) option is set to `true`, since the sizes stored in the
central directory make it unnecessary to read it otherwise.

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

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraFieldExtendedTimestamp`](EntryExtraFieldExtendedTimestamp.md)

The extended timestamp extra field.

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraFieldUnix`](EntryExtraFieldUnix.md)

The Info-ZIP New Unix extra field (0x7875), storing variable-length uid/gid in both headers.

***

### extraFieldLength

> **extraFieldLength**: `number`

The length of the extra field in bytes.

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraFieldNTFS`](EntryExtraFieldNTFS.md)

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

> `optional` **extraFieldUnix?**: [`EntryExtraFieldUnix`](EntryExtraFieldUnix.md)

The Info-ZIP Unix type 2 extra field (0x7855). Its uid/gid are stored in the local file header only, the
central directory version carries no data and merely flags their presence.

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

> `optional` **extraFieldZip64?**: [`EntryExtraFieldZip64`](EntryExtraFieldZip64.md)

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

### rawFilename?

> `optional` **rawFilename?**: `Uint8Array`\<`ArrayBufferLike`\>

The filename of the entry stored in the local file header (raw), which is allowed to differ from
[EntryMetaData#rawFilename](EntryMetaData.md#rawfilename).

Only defined when the local filename has been read, i.e. when the [ZipReaderOptions#strictness](ZipReaderOptions.md#strictness) option
is set to `"strict"` or when the [ZipReaderOptions#checkLocalDirectory](ZipReaderOptions.md#checklocaldirectory) option is set to `true`, since
reading it costs one read the central directory does not need.

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
