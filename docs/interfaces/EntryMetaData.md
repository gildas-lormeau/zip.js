[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Defined in: [index.d.ts:1423](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1423)

Represents the metadata of an entry in a zip file (Core API).

## Extended by

- [`DirectoryEntry`](DirectoryEntry.md)
- [`FileEntry`](FileEntry.md)

## Properties

### bitFlag?

> `optional` **bitFlag?**: [`EntryBitFlag`](EntryBitFlag.md)

Defined in: [index.d.ts:1634](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1634)

The general purpose bit flag.

***

### comment

> **comment**: `string`

Defined in: [index.d.ts:1487](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1487)

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:1495](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1495)

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:1455](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1455)

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1626](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1626)

The compression method.

***

### crc32?

> `optional` **crc32?**: `number`

Defined in: [index.d.ts:1500](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1500)

The CRC-32 checksum of the content. It is `undefined` when the zip file does not store it, e.g. for entries
encrypted with AES in AE-2 format.

***

### creationDate?

> `optional` **creationDate?**: `Date`

Defined in: [index.d.ts:1471](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1471)

The creation date.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1622](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1622)

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1447](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1447)

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:1443](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1443)

`true` if the entry is an executable file

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1618](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1618)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1601](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1601)

The 32-bit `externalFileAttributes` field is the authoritative on-disk metadata for each entry.
- Upper 16 bits: Unix mode/type (e.g., permissions, file type)
- Low 8 bits: MS-DOS file attributes (e.g., directory, read-only)

When writing, all provided options are merged into this field. When reading, convenience fields are decoded from it.
For most use cases, prefer the high-level options and fields; only advanced users need to manipulate the raw value directly.

***

### extraField?

> `optional` **extraField?**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:1511](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1511)

The extra field.

***

### extraFieldAES?

> `optional` **extraFieldAES?**: [`EntryExtraFieldAES`](EntryExtraFieldAES.md)

Defined in: [index.d.ts:1650](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1650)

The AES extra field.

***

### extraFieldExtendedTimestamp?

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1666](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1666)

The extended timestamp extra field.

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1662](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1662)

The Info-ZIP Unix extra field.

***

### extraFieldLength?

> `optional` **extraFieldLength?**: `number`

Defined in: [index.d.ts:1642](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1642)

The length of the extra field in bytes.

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1654](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1654)

The NTFS extra field.

***

### extraFieldUnicodeComment?

> `optional` **extraFieldUnicodeComment?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1674](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1674)

The Unicode comment extra field.

***

### extraFieldUnicodePath?

> `optional` **extraFieldUnicodePath?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1670](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1670)

The Unicode path extra field.

***

### extraFieldUnix?

> `optional` **extraFieldUnix?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1658](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1658)

The Unix extra field.

***

### extraFieldUSDZ?

> `optional` **extraFieldUSDZ?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1678](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1678)

The USDZ extra field.

***

### extraFieldZip64?

> `optional` **extraFieldZip64?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1646](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1646)

The Zip64 extra field.

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:1431](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1431)

The filename of the entry.

***

### filenameLength?

> `optional` **filenameLength?**: `number`

Defined in: [index.d.ts:1638](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1638)

The length of the filename in bytes.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:1439](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1439)

`true` if the filename is encoded in UTF-8.

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1572](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1572)

Unix group id when available.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1613](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1613)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1592](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1592)

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1467](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1467)

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1463](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1463)

The last modification date.

***

### localDirectory?

> `optional` **localDirectory?**: [`LocalDirectory`](LocalDirectory.md)

Defined in: [index.d.ts:1682](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1682)

The local file header fields, set when the entry data has been read.

***

### msdosAttributes?

> `optional` **msdosAttributes?**: `object`

Defined in: [index.d.ts:1558](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1558)

The MS-DOS attribute flags exposed as booleans.

#### archive

> **archive**: `boolean`

#### directory

> **directory**: `boolean`

#### hidden

> **hidden**: `boolean`

#### readOnly

> **readOnly**: `boolean`

#### system

> **system**: `boolean`

***

### msdosAttributesRaw?

> `optional` **msdosAttributesRaw?**: `number`

Defined in: [index.d.ts:1554](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1554)

The MS-DOS attributes low byte (raw).
This is the low 8 bits of [EntryMetaData#externalFileAttributes](#externalfileattributes) when present.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1531](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1531)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:1427](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1427)

The byte offset of the entry.

***

### rawBitFlag?

> `optional` **rawBitFlag?**: `number`

Defined in: [index.d.ts:1630](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1630)

The general purpose bit flag (raw).

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:1491](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1491)

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate?**: `number` \| `bigint`

Defined in: [index.d.ts:1483](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1483)

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1515](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1515)

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:1435](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1435)

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate?**: `number` \| `bigint`

Defined in: [index.d.ts:1479](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1479)

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:1475](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1475)

The last modification date (raw).

***

### setgid?

> `optional` **setgid?**: `boolean`

Defined in: [index.d.ts:1584](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1584)

`true` if the setgid bit is set on the entry.

***

### setuid?

> `optional` **setuid?**: `boolean`

Defined in: [index.d.ts:1580](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1580)

`true` if the setuid bit is set on the entry.

***

### ~~signature?~~

> `optional` **signature?**: `number`

Defined in: [index.d.ts:1507](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1507)

The signature (CRC32 checksum) of the content. It is `undefined` for entries encrypted with AES returned by
[ZipWriter#add](../classes/ZipWriter.md#add).

#### Deprecated

Use [EntryMetaData#crc32](#crc32) instead.

***

### sticky?

> `optional` **sticky?**: `boolean`

Defined in: [index.d.ts:1588](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1588)

`true` if the sticky bit is set on the entry.

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:1568](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1568)

Unix owner id when available.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1459](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1459)

The size of the decompressed data in bytes.

***

### unixExternalUpper?

> `optional` **unixExternalUpper?**: `number`

Defined in: [index.d.ts:1605](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1605)

The upper 16-bit portion of [EntryMetaData#externalFileAttributes](#externalfileattributes) when it represents Unix mode bits.

***

### unixMode?

> `optional` **unixMode?**: `number`

Defined in: [index.d.ts:1576](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1576)

Unix mode (st_mode) when available.

***

### version

> **version**: `number`

Defined in: [index.d.ts:1523](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1523)

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:1527](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1527)

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:1519](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1519)

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:1451](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L1451)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
