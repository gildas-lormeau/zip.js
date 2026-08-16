[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / DirectoryEntry

# Interface: DirectoryEntry

Defined in: [index.d.ts:1949](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1949)

Represents the metadata of an entry in a zip file (Core API).

## Extends

- [`EntryMetaData`](EntryMetaData.md)

## Properties

### bitFlag?

> `optional` **bitFlag?**: [`EntryBitFlag`](EntryBitFlag.md)

Defined in: [index.d.ts:1891](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1891)

The general purpose bit flag.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`bitFlag`](EntryMetaData.md#bitflag)

***

### comment

> **comment**: `string`

Defined in: [index.d.ts:1744](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1744)

The comment of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`comment`](EntryMetaData.md#comment)

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:1752](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1752)

`true` if the comment is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`commentUTF8`](EntryMetaData.md#commentutf8)

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:1712](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1712)

The size of the compressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressedSize`](EntryMetaData.md#compressedsize)

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1883](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1883)

The compression method.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressionMethod`](EntryMetaData.md#compressionmethod)

***

### crc32?

> `optional` **crc32?**: `number`

Defined in: [index.d.ts:1757](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1757)

The CRC-32 checksum of the content. It is `undefined` when the zip file does not store it, e.g. for entries
encrypted with AES in AE-2 format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`crc32`](EntryMetaData.md#crc32)

***

### creationDate?

> `optional` **creationDate?**: `Date`

Defined in: [index.d.ts:1728](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1728)

The creation date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`creationDate`](EntryMetaData.md#creationdate)

***

### directory

> **directory**: `true`

Defined in: [index.d.ts:1953](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1953)

`true` if the entry is a directory.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1879](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1879)

The number of the disk where the entry data starts.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`diskNumberStart`](EntryMetaData.md#disknumberstart)

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1704](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1704)

`true` if the content of the entry is encrypted.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`encrypted`](EntryMetaData.md#encrypted)

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:1700](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1700)

`true` if the entry is an executable file

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`executable`](EntryMetaData.md#executable)

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1875](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1875)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttribute`](EntryMetaData.md#externalfileattribute)

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1858](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1858)

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

Defined in: [index.d.ts:1768](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1768)

The extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraField`](EntryMetaData.md#extrafield)

***

### extraFieldAES?

> `optional` **extraFieldAES?**: [`EntryExtraFieldAES`](EntryExtraFieldAES.md)

Defined in: [index.d.ts:1907](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1907)

The AES extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldAES`](EntryMetaData.md#extrafieldaes)

***

### extraFieldExtendedTimestamp?

> `optional` **extraFieldExtendedTimestamp?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1931](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1931)

The extended timestamp extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldExtendedTimestamp`](EntryMetaData.md#extrafieldextendedtimestamp)

***

### extraFieldInfoZip?

> `optional` **extraFieldInfoZip?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1919](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1919)

The Info-ZIP Unix extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldInfoZip`](EntryMetaData.md#extrafieldinfozip)

***

### extraFieldLength?

> `optional` **extraFieldLength?**: `number`

Defined in: [index.d.ts:1899](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1899)

The length of the extra field in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldLength`](EntryMetaData.md#extrafieldlength)

***

### extraFieldNTFS?

> `optional` **extraFieldNTFS?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1911](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1911)

The NTFS extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldNTFS`](EntryMetaData.md#extrafieldntfs)

***

### extraFieldPkwareUnix?

> `optional` **extraFieldPkwareUnix?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

Defined in: [index.d.ts:1927](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1927)

The PKWARE Unix extra field (0x000d).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldPkwareUnix`](EntryMetaData.md#extrafieldpkwareunix)

***

### extraFieldUnicodeComment?

> `optional` **extraFieldUnicodeComment?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1939](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1939)

The Unicode comment extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnicodeComment`](EntryMetaData.md#extrafieldunicodecomment)

***

### extraFieldUnicodePath?

> `optional` **extraFieldUnicodePath?**: [`EntryExtraFieldUnicode`](EntryExtraFieldUnicode.md)

Defined in: [index.d.ts:1935](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1935)

The Unicode path extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnicodePath`](EntryMetaData.md#extrafieldunicodepath)

***

### extraFieldUnix?

> `optional` **extraFieldUnix?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1915](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1915)

The Unix extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnix`](EntryMetaData.md#extrafieldunix)

***

### extraFieldUnixType1?

> `optional` **extraFieldUnixType1?**: [`EntryExtraFieldUnixDates`](EntryExtraFieldUnixDates.md)

Defined in: [index.d.ts:1923](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1923)

The Info-ZIP Unix type 1 extra field (0x5855).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUnixType1`](EntryMetaData.md#extrafieldunixtype1)

***

### extraFieldUSDZ?

> `optional` **extraFieldUSDZ?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1943](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1943)

The USDZ extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldUSDZ`](EntryMetaData.md#extrafieldusdz)

***

### extraFieldZip64?

> `optional` **extraFieldZip64?**: [`EntryExtraField`](EntryExtraField.md)

Defined in: [index.d.ts:1903](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1903)

The Zip64 extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraFieldZip64`](EntryMetaData.md#extrafieldzip64)

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:1688](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1688)

The filename of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filename`](EntryMetaData.md#filename)

***

### filenameLength?

> `optional` **filenameLength?**: `number`

Defined in: [index.d.ts:1895](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1895)

The length of the filename in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameLength`](EntryMetaData.md#filenamelength)

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:1696](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1696)

`true` if the filename is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameUTF8`](EntryMetaData.md#filenameutf8)

***

### gid?

> `optional` **gid?**: `number`

Defined in: [index.d.ts:1829](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1829)

Unix group id when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`gid`](EntryMetaData.md#gid)

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1870](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1870)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](EntryMetaData.md#internalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttribute`](EntryMetaData.md#internalfileattribute)

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1849](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1849)

The internal file attributes (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttributes`](EntryMetaData.md#internalfileattributes)

***

### lastAccessDate?

> `optional` **lastAccessDate?**: `Date`

Defined in: [index.d.ts:1724](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1724)

The last access date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastAccessDate`](EntryMetaData.md#lastaccessdate)

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1720](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1720)

The last modification date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastModDate`](EntryMetaData.md#lastmoddate)

***

### localDirectory?

> `optional` **localDirectory?**: [`LocalDirectory`](LocalDirectory.md)

Defined in: [index.d.ts:1947](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1947)

The local file header fields, set when the entry data has been read.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`localDirectory`](EntryMetaData.md#localdirectory)

***

### msdosAttributes?

> `optional` **msdosAttributes?**: `object`

Defined in: [index.d.ts:1815](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1815)

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

Defined in: [index.d.ts:1811](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1811)

The MS-DOS attributes low byte (raw).
This is the low 8 bits of [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) when present.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msdosAttributesRaw`](EntryMetaData.md#msdosattributesraw)

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1788](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1788)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msDosCompatible`](EntryMetaData.md#msdoscompatible)

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:1684](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1684)

The byte offset of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`offset`](EntryMetaData.md#offset)

***

### rawBitFlag?

> `optional` **rawBitFlag?**: `number`

Defined in: [index.d.ts:1887](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1887)

The general purpose bit flag (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawBitFlag`](EntryMetaData.md#rawbitflag)

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:1748](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1748)

The comment of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawComment`](EntryMetaData.md#rawcomment)

***

### rawCreationDate?

> `optional` **rawCreationDate?**: `number` \| `bigint`

Defined in: [index.d.ts:1740](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1740)

The creation date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawCreationDate`](EntryMetaData.md#rawcreationdate)

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1772](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1772)

The extra field (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawExtraField`](EntryMetaData.md#rawextrafield)

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:1692](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1692)

The filename of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawFilename`](EntryMetaData.md#rawfilename)

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate?**: `number` \| `bigint`

Defined in: [index.d.ts:1736](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1736)

The last access date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastAccessDate`](EntryMetaData.md#rawlastaccessdate)

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:1732](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1732)

The last modification date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastModDate`](EntryMetaData.md#rawlastmoddate)

***

### setgid?

> `optional` **setgid?**: `boolean`

Defined in: [index.d.ts:1841](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1841)

`true` if the setgid bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`setgid`](EntryMetaData.md#setgid)

***

### setuid?

> `optional` **setuid?**: `boolean`

Defined in: [index.d.ts:1837](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1837)

`true` if the setuid bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`setuid`](EntryMetaData.md#setuid)

***

### ~~signature?~~

> `optional` **signature?**: `number`

Defined in: [index.d.ts:1764](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1764)

The signature (CRC32 checksum) of the content. It is `undefined` for entries encrypted with AES returned by
[ZipWriter#add](../classes/ZipWriter.md#add).

#### Deprecated

Use [EntryMetaData#crc32](EntryMetaData.md#crc32) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`signature`](EntryMetaData.md#signature)

***

### sticky?

> `optional` **sticky?**: `boolean`

Defined in: [index.d.ts:1845](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1845)

`true` if the sticky bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`sticky`](EntryMetaData.md#sticky)

***

### uid?

> `optional` **uid?**: `number`

Defined in: [index.d.ts:1825](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1825)

Unix owner id when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uid`](EntryMetaData.md#uid)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1716](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1716)

The size of the decompressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uncompressedSize`](EntryMetaData.md#uncompressedsize)

***

### unixExternalUpper?

> `optional` **unixExternalUpper?**: `number`

Defined in: [index.d.ts:1862](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1862)

The upper 16-bit portion of [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) when it represents Unix mode bits.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`unixExternalUpper`](EntryMetaData.md#unixexternalupper)

***

### unixMode?

> `optional` **unixMode?**: `number`

Defined in: [index.d.ts:1833](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1833)

Unix mode (st_mode) when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`unixMode`](EntryMetaData.md#unixmode)

***

### version

> **version**: `number`

Defined in: [index.d.ts:1780](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1780)

The "Version" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`version`](EntryMetaData.md#version)

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:1784](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1784)

The "Version made by" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`versionMadeBy`](EntryMetaData.md#versionmadeby)

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:1776](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1776)

`true` if the entry is using Zip64.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zip64`](EntryMetaData.md#zip64)

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:1708](https://github.com/gildas-lormeau/zip.js/blob/1508d5ac4ac7985c21cdd9cc0be315b0cf9a547f/index.d.ts#L1708)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zipCrypto`](EntryMetaData.md#zipcrypto)
