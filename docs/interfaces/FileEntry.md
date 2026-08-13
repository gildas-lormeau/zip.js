[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / FileEntry

# Interface: FileEntry

Defined in: [index.d.ts:1821](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1821)

Represents the metadata of an entry in a zip file (Core API).

## Extends

- [`EntryMetaData`](EntryMetaData.md)

## Properties

### bitFlag?

> `optional` **bitFlag?**: [`EntryBitFlag`](EntryBitFlag.md)

Defined in: [index.d.ts:1756](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1756)

The general purpose bit flag.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`bitFlag`](EntryMetaData.md#bitflag)

***

### comment

> **comment**: `string`

Defined in: [index.d.ts:1609](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1609)

The comment of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`comment`](EntryMetaData.md#comment)

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:1617](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1617)

`true` if the comment is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`commentUTF8`](EntryMetaData.md#commentutf8)

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:1577](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1577)

The size of the compressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressedSize`](EntryMetaData.md#compressedsize)

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1748](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1748)

The compression method.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressionMethod`](EntryMetaData.md#compressionmethod)

***

### crc32?

> `optional` **crc32?**: `number`

Defined in: [index.d.ts:1622](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1622)

The CRC-32 checksum of the content. It is `undefined` when the zip file does not store it, e.g. for entries
encrypted with AES in AE-2 format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`crc32`](EntryMetaData.md#crc32)

***

### creationDate?

> `optional` **creationDate?**: `Date`

Defined in: [index.d.ts:1593](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1593)

The creation date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`creationDate`](EntryMetaData.md#creationdate)

***

### directory

> **directory**: `false`

Defined in: [index.d.ts:1825](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1825)

`false` if the entry is a file.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1744](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1744)

The number of the disk where the entry data starts.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`diskNumberStart`](EntryMetaData.md#disknumberstart)

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1569](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1569)

`true` if the content of the entry is encrypted.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`encrypted`](EntryMetaData.md#encrypted)

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:1565](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1565)

`true` if the entry is an executable file

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`executable`](EntryMetaData.md#executable)

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1740](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1740)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttribute`](EntryMetaData.md#externalfileattribute)

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1723](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1723)

The 32-bit `externalFileAttributes` field is the authoritative on-disk metadata for each entry.
- Upper 16 bits: Unix mode/type (e.g., permissions, file type)
- Low 8 bits: MS-DOS file attributes (e.g., directory, read-only)

When writing, all provided options are merged into this field. When reading, convenience fields are decoded from it.
For most use cases, prefer the high-level options and fields; only advanced users need to manipulate the raw value directly.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttributes`](EntryMetaData.md#externalfileattributes)

***

### extraField?

> `optional` **extraField?**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:1633](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1633)

The extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraField`](EntryMetaData.md#extrafield)

***

### extraFieldAES?

> `optional` **extraFieldAES?**: [`EntryExtraFieldAES`](EntryExtraFieldAES.md)

Defined in: [index.d.ts:1772](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1772)

The AES extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldAES`](EntryMetaData.md#extrafieldaes)

***

### extraFieldExtendedTimestamp?

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1796](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1796)

The extended timestamp extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldExtendedTimestamp`](EntryMetaData.md#extrafieldextendedtimestamp)

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1784](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1784)

The Info-ZIP Unix extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldInfoZip`](EntryMetaData.md#extrafieldinfozip)

***

### extraFieldLength?

> `optional` **extraFieldLength?**: `number`

Defined in: [index.d.ts:1764](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1764)

The length of the extra field in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldLength`](EntryMetaData.md#extrafieldlength)

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1776](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1776)

The NTFS extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldNTFS`](EntryMetaData.md#extrafieldntfs)

***

### extraFieldPkwareUnix?

> `optional` **extraFieldPkwareUnix?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

Defined in: [index.d.ts:1792](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1792)

The PKWARE Unix extra field (0x000d).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldPkwareUnix`](EntryMetaData.md#extrafieldpkwareunix)

***

### extraFieldUnicodeComment?

> `optional` **extraFieldUnicodeComment?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1804](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1804)

The Unicode comment extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnicodeComment`](EntryMetaData.md#extrafieldunicodecomment)

***

### extraFieldUnicodePath?

> `optional` **extraFieldUnicodePath?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1800](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1800)

The Unicode path extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnicodePath`](EntryMetaData.md#extrafieldunicodepath)

***

### extraFieldUnix?

> `optional` **extraFieldUnix?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1780](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1780)

The Unix extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnix`](EntryMetaData.md#extrafieldunix)

***

### extraFieldUnixType1?

> `optional` **extraFieldUnixType1?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

Defined in: [index.d.ts:1788](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1788)

The Info-ZIP Unix type 1 extra field (0x5855).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnixType1`](EntryMetaData.md#extrafieldunixtype1)

***

### extraFieldUSDZ?

> `optional` **extraFieldUSDZ?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1808](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1808)

The USDZ extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUSDZ`](EntryMetaData.md#extrafieldusdz)

***

### extraFieldZip64?

> `optional` **extraFieldZip64?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1768](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1768)

The Zip64 extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldZip64`](EntryMetaData.md#extrafieldzip64)

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:1553](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1553)

The filename of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filename`](EntryMetaData.md#filename)

***

### filenameLength?

> `optional` **filenameLength?**: `number`

Defined in: [index.d.ts:1760](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1760)

The length of the filename in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameLength`](EntryMetaData.md#filenamelength)

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:1561](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1561)

`true` if the filename is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameUTF8`](EntryMetaData.md#filenameutf8)

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1694](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1694)

Unix group id when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`gid`](EntryMetaData.md#gid)

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1735](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1735)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](EntryMetaData.md#internalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttribute`](EntryMetaData.md#internalfileattribute)

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1714](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1714)

The internal file attributes (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttributes`](EntryMetaData.md#internalfileattributes)

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1589](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1589)

The last access date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastAccessDate`](EntryMetaData.md#lastaccessdate)

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1585](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1585)

The last modification date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastModDate`](EntryMetaData.md#lastmoddate)

***

### localDirectory?

> `optional` **localDirectory?**: [`LocalDirectory`](LocalDirectory.md)

Defined in: [index.d.ts:1812](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1812)

The local file header fields, set when the entry data has been read.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`localDirectory`](EntryMetaData.md#localdirectory)

***

### msdosAttributes?

> `optional` **msdosAttributes?**: `object`

Defined in: [index.d.ts:1680](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1680)

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

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msdosAttributes`](EntryMetaData.md#msdosattributes)

***

### msdosAttributesRaw?

> `optional` **msdosAttributesRaw?**: `number`

Defined in: [index.d.ts:1676](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1676)

The MS-DOS attributes low byte (raw).
This is the low 8 bits of [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) when present.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msdosAttributesRaw`](EntryMetaData.md#msdosattributesraw)

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1653](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1653)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msDosCompatible`](EntryMetaData.md#msdoscompatible)

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:1549](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1549)

The byte offset of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`offset`](EntryMetaData.md#offset)

***

### rawBitFlag?

> `optional` **rawBitFlag?**: `number`

Defined in: [index.d.ts:1752](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1752)

The general purpose bit flag (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawBitFlag`](EntryMetaData.md#rawbitflag)

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:1613](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1613)

The comment of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawComment`](EntryMetaData.md#rawcomment)

***

### rawCreationDate?

> `optional` **rawCreationDate?**: `number` \| `bigint`

Defined in: [index.d.ts:1605](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1605)

The creation date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawCreationDate`](EntryMetaData.md#rawcreationdate)

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1637](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1637)

The extra field (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawExtraField`](EntryMetaData.md#rawextrafield)

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:1557](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1557)

The filename of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawFilename`](EntryMetaData.md#rawfilename)

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate?**: `number` \| `bigint`

Defined in: [index.d.ts:1601](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1601)

The last access date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastAccessDate`](EntryMetaData.md#rawlastaccessdate)

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:1597](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1597)

The last modification date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastModDate`](EntryMetaData.md#rawlastmoddate)

***

### setgid?

> `optional` **setgid?**: `boolean`

Defined in: [index.d.ts:1706](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1706)

`true` if the setgid bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`setgid`](EntryMetaData.md#setgid)

***

### setuid?

> `optional` **setuid?**: `boolean`

Defined in: [index.d.ts:1702](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1702)

`true` if the setuid bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`setuid`](EntryMetaData.md#setuid)

***

### ~~signature?~~

> `optional` **signature?**: `number`

Defined in: [index.d.ts:1629](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1629)

The signature (CRC32 checksum) of the content. It is `undefined` for entries encrypted with AES returned by
[ZipWriter#add](../classes/ZipWriter.md#add).

#### Deprecated

Use [EntryMetaData#crc32](EntryMetaData.md#crc32) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`signature`](EntryMetaData.md#signature)

***

### sticky?

> `optional` **sticky?**: `boolean`

Defined in: [index.d.ts:1710](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1710)

`true` if the sticky bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`sticky`](EntryMetaData.md#sticky)

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:1690](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1690)

Unix owner id when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uid`](EntryMetaData.md#uid)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1581](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1581)

The size of the decompressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uncompressedSize`](EntryMetaData.md#uncompressedsize)

***

### unixExternalUpper?

> `optional` **unixExternalUpper?**: `number`

Defined in: [index.d.ts:1727](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1727)

The upper 16-bit portion of [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) when it represents Unix mode bits.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`unixExternalUpper`](EntryMetaData.md#unixexternalupper)

***

### unixMode?

> `optional` **unixMode?**: `number`

Defined in: [index.d.ts:1698](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1698)

Unix mode (st_mode) when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`unixMode`](EntryMetaData.md#unixmode)

***

### version

> **version**: `number`

Defined in: [index.d.ts:1645](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1645)

The "Version" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`version`](EntryMetaData.md#version)

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:1649](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1649)

The "Version made by" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`versionMadeBy`](EntryMetaData.md#versionmadeby)

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:1641](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1641)

`true` if the entry is using Zip64.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zip64`](EntryMetaData.md#zip64)

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:1573](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1573)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zipCrypto`](EntryMetaData.md#zipcrypto)

## Methods

### arrayBuffer()

> **arrayBuffer**(`options?`): `Promise`\<`ArrayBuffer`\>

Defined in: [index.d.ts:1850](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1850)

Retrieves the content of the entry as an `ArrayBuffer` instance

#### Parameters

##### options?

[`EntryGetDataOptions`](EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`ArrayBuffer`\>

A promise resolving to an `ArrayBuffer` instance.

***

### getData()

> **getData**\<`Type`\>(`writer`, `options?`): `Promise`\<`Type`\>

Defined in: [index.d.ts:1833](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L1833)

Returns the content of the entry

#### Type Parameters

##### Type

`Type`

#### Parameters

##### writer

`WritableStream`\<`any`\> \| [`WritableWriter`](WritableWriter.md) \| `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](WritableWriter.md) \| [`Writer`](../classes/Writer.md)\<`unknown`\>, `boolean`, `any`\> \| [`Writer`](../classes/Writer.md)\<`Type`\>

The [Writer](../classes/Writer.md) instance used to write the content of the entry.

##### options?

[`EntryGetDataCheckPasswordOptions`](EntryGetDataCheckPasswordOptions.md)

The options.

#### Returns

`Promise`\<`Type`\>

A promise resolving to the type to data associated to `writer`.
