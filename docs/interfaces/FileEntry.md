[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / FileEntry

# Interface: FileEntry

Defined in: [index.d.ts:1731](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1731)

Represents the metadata of an entry in a zip file (Core API).

## Extends

- [`EntryMetaData`](EntryMetaData.md)

## Properties

### bitFlag?

> `optional` **bitFlag?**: [`EntryBitFlag`](EntryBitFlag.md)

Defined in: [index.d.ts:1666](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1666)

The general purpose bit flag.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`bitFlag`](EntryMetaData.md#bitflag)

***

### comment

> **comment**: `string`

Defined in: [index.d.ts:1519](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1519)

The comment of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`comment`](EntryMetaData.md#comment)

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:1527](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1527)

`true` if the comment is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`commentUTF8`](EntryMetaData.md#commentutf8)

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:1487](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1487)

The size of the compressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressedSize`](EntryMetaData.md#compressedsize)

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1658](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1658)

The compression method.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressionMethod`](EntryMetaData.md#compressionmethod)

***

### crc32?

> `optional` **crc32?**: `number`

Defined in: [index.d.ts:1532](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1532)

The CRC-32 checksum of the content. It is `undefined` when the zip file does not store it, e.g. for entries
encrypted with AES in AE-2 format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`crc32`](EntryMetaData.md#crc32)

***

### creationDate?

> `optional` **creationDate?**: `Date`

Defined in: [index.d.ts:1503](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1503)

The creation date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`creationDate`](EntryMetaData.md#creationdate)

***

### directory

> **directory**: `false`

Defined in: [index.d.ts:1735](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1735)

`false` if the entry is a file.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1654](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1654)

The number of the disk where the entry data starts.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`diskNumberStart`](EntryMetaData.md#disknumberstart)

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1479](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1479)

`true` if the content of the entry is encrypted.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`encrypted`](EntryMetaData.md#encrypted)

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:1475](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1475)

`true` if the entry is an executable file

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`executable`](EntryMetaData.md#executable)

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1650](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1650)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttribute`](EntryMetaData.md#externalfileattribute)

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1633](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1633)

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

Defined in: [index.d.ts:1543](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1543)

The extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraField`](EntryMetaData.md#extrafield)

***

### extraFieldAES?

> `optional` **extraFieldAES?**: [`EntryExtraFieldAES`](EntryExtraFieldAES.md)

Defined in: [index.d.ts:1682](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1682)

The AES extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldAES`](EntryMetaData.md#extrafieldaes)

***

### extraFieldExtendedTimestamp?

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1706](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1706)

The extended timestamp extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldExtendedTimestamp`](EntryMetaData.md#extrafieldextendedtimestamp)

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1694](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1694)

The Info-ZIP Unix extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldInfoZip`](EntryMetaData.md#extrafieldinfozip)

***

### extraFieldLength?

> `optional` **extraFieldLength?**: `number`

Defined in: [index.d.ts:1674](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1674)

The length of the extra field in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldLength`](EntryMetaData.md#extrafieldlength)

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1686](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1686)

The NTFS extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldNTFS`](EntryMetaData.md#extrafieldntfs)

***

### extraFieldPkwareUnix?

> `optional` **extraFieldPkwareUnix?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

Defined in: [index.d.ts:1702](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1702)

The PKWARE Unix extra field (0x000d).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldPkwareUnix`](EntryMetaData.md#extrafieldpkwareunix)

***

### extraFieldUnicodeComment?

> `optional` **extraFieldUnicodeComment?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1714](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1714)

The Unicode comment extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnicodeComment`](EntryMetaData.md#extrafieldunicodecomment)

***

### extraFieldUnicodePath?

> `optional` **extraFieldUnicodePath?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1710](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1710)

The Unicode path extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnicodePath`](EntryMetaData.md#extrafieldunicodepath)

***

### extraFieldUnix?

> `optional` **extraFieldUnix?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1690](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1690)

The Unix extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnix`](EntryMetaData.md#extrafieldunix)

***

### extraFieldUnixType1?

> `optional` **extraFieldUnixType1?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

Defined in: [index.d.ts:1698](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1698)

The Info-ZIP Unix type 1 extra field (0x5855).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnixType1`](EntryMetaData.md#extrafieldunixtype1)

***

### extraFieldUSDZ?

> `optional` **extraFieldUSDZ?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1718](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1718)

The USDZ extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUSDZ`](EntryMetaData.md#extrafieldusdz)

***

### extraFieldZip64?

> `optional` **extraFieldZip64?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1678](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1678)

The Zip64 extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldZip64`](EntryMetaData.md#extrafieldzip64)

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:1463](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1463)

The filename of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filename`](EntryMetaData.md#filename)

***

### filenameLength?

> `optional` **filenameLength?**: `number`

Defined in: [index.d.ts:1670](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1670)

The length of the filename in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameLength`](EntryMetaData.md#filenamelength)

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:1471](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1471)

`true` if the filename is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameUTF8`](EntryMetaData.md#filenameutf8)

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1604](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1604)

Unix group id when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`gid`](EntryMetaData.md#gid)

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1645](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1645)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](EntryMetaData.md#internalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttribute`](EntryMetaData.md#internalfileattribute)

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1624](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1624)

The internal file attributes (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttributes`](EntryMetaData.md#internalfileattributes)

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1499](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1499)

The last access date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastAccessDate`](EntryMetaData.md#lastaccessdate)

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1495](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1495)

The last modification date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastModDate`](EntryMetaData.md#lastmoddate)

***

### localDirectory?

> `optional` **localDirectory?**: [`LocalDirectory`](LocalDirectory.md)

Defined in: [index.d.ts:1722](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1722)

The local file header fields, set when the entry data has been read.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`localDirectory`](EntryMetaData.md#localdirectory)

***

### msdosAttributes?

> `optional` **msdosAttributes?**: `object`

Defined in: [index.d.ts:1590](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1590)

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

Defined in: [index.d.ts:1586](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1586)

The MS-DOS attributes low byte (raw).
This is the low 8 bits of [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) when present.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msdosAttributesRaw`](EntryMetaData.md#msdosattributesraw)

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1563](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1563)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msDosCompatible`](EntryMetaData.md#msdoscompatible)

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:1459](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1459)

The byte offset of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`offset`](EntryMetaData.md#offset)

***

### rawBitFlag?

> `optional` **rawBitFlag?**: `number`

Defined in: [index.d.ts:1662](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1662)

The general purpose bit flag (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawBitFlag`](EntryMetaData.md#rawbitflag)

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:1523](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1523)

The comment of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawComment`](EntryMetaData.md#rawcomment)

***

### rawCreationDate?

> `optional` **rawCreationDate?**: `number` \| `bigint`

Defined in: [index.d.ts:1515](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1515)

The creation date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawCreationDate`](EntryMetaData.md#rawcreationdate)

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1547](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1547)

The extra field (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawExtraField`](EntryMetaData.md#rawextrafield)

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:1467](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1467)

The filename of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawFilename`](EntryMetaData.md#rawfilename)

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate?**: `number` \| `bigint`

Defined in: [index.d.ts:1511](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1511)

The last access date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastAccessDate`](EntryMetaData.md#rawlastaccessdate)

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:1507](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1507)

The last modification date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastModDate`](EntryMetaData.md#rawlastmoddate)

***

### setgid?

> `optional` **setgid?**: `boolean`

Defined in: [index.d.ts:1616](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1616)

`true` if the setgid bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`setgid`](EntryMetaData.md#setgid)

***

### setuid?

> `optional` **setuid?**: `boolean`

Defined in: [index.d.ts:1612](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1612)

`true` if the setuid bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`setuid`](EntryMetaData.md#setuid)

***

### ~~signature?~~

> `optional` **signature?**: `number`

Defined in: [index.d.ts:1539](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1539)

The signature (CRC32 checksum) of the content. It is `undefined` for entries encrypted with AES returned by
[ZipWriter#add](../classes/ZipWriter.md#add).

#### Deprecated

Use [EntryMetaData#crc32](EntryMetaData.md#crc32) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`signature`](EntryMetaData.md#signature)

***

### sticky?

> `optional` **sticky?**: `boolean`

Defined in: [index.d.ts:1620](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1620)

`true` if the sticky bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`sticky`](EntryMetaData.md#sticky)

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:1600](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1600)

Unix owner id when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uid`](EntryMetaData.md#uid)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1491](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1491)

The size of the decompressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uncompressedSize`](EntryMetaData.md#uncompressedsize)

***

### unixExternalUpper?

> `optional` **unixExternalUpper?**: `number`

Defined in: [index.d.ts:1637](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1637)

The upper 16-bit portion of [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) when it represents Unix mode bits.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`unixExternalUpper`](EntryMetaData.md#unixexternalupper)

***

### unixMode?

> `optional` **unixMode?**: `number`

Defined in: [index.d.ts:1608](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1608)

Unix mode (st_mode) when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`unixMode`](EntryMetaData.md#unixmode)

***

### version

> **version**: `number`

Defined in: [index.d.ts:1555](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1555)

The "Version" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`version`](EntryMetaData.md#version)

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:1559](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1559)

The "Version made by" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`versionMadeBy`](EntryMetaData.md#versionmadeby)

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:1551](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1551)

`true` if the entry is using Zip64.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zip64`](EntryMetaData.md#zip64)

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:1483](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1483)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zipCrypto`](EntryMetaData.md#zipcrypto)

## Methods

### arrayBuffer()

> **arrayBuffer**(`options?`): `Promise`\<`ArrayBuffer`\>

Defined in: [index.d.ts:1760](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1760)

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

Defined in: [index.d.ts:1743](https://github.com/gildas-lormeau/zip.js/blob/827a5b5e74129baaeb2fd91ddb78a9aa9a253d8a/index.d.ts#L1743)

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
