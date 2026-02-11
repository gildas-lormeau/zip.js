[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Defined in: [index.d.ts:899](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L899)

Represents the metadata of an entry in a zip file (Core API).

## Extended by

- [`DirectoryEntry`](DirectoryEntry.md)
- [`FileEntry`](FileEntry.md)

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:963](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L963)

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:971](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L971)

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:931](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L931)

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1092](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1092)

The compression method.

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:947](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L947)

The creation date.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1088](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1088)

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:923](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L923)

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:919](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L919)

`true` if the entry is an executable file

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1084](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1084)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1067](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1067)

The 32-bit `externalFileAttributes` field is the authoritative on-disk metadata for each entry.
- Upper 16 bits: Unix mode/type (e.g., permissions, file type)
- Low 8 bits: MS-DOS file attributes (e.g., directory, read-only)

When writing, all provided options are merged into this field. When reading, convenience fields are decoded from it.
For most use cases, prefer the high-level options and fields; only advanced users need to manipulate the raw value directly.

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:979](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L979)

The extra field.

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:907](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L907)

The filename of the entry.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:915](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L915)

`true` if the filename is encoded in UTF-8.

***

### gid?

> `optional` **gid**: `number`

Defined in: [index.d.ts:1038](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1038)

Unix group id when available.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1079](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1079)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1058](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1058)

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:943](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L943)

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:939](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L939)

The last modification date.

***

### msdosAttributes?

> `optional` **msdosAttributes**: `object`

Defined in: [index.d.ts:1024](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1024)

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

> `optional` **msdosAttributesRaw**: `number`

Defined in: [index.d.ts:1020](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1020)

The MS-DOS attributes low byte (raw).
This is the low 8 bits of [EntryMetaData#externalFileAttributes](#externalfileattributes) when present.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:999](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L999)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:903](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L903)

The byte offset of the entry.

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:967](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L967)

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:959](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L959)

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:983](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L983)

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:911](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L911)

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:955](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L955)

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:951](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L951)

The last modification date (raw).

***

### setgid?

> `optional` **setgid**: `boolean`

Defined in: [index.d.ts:1050](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1050)

`true` if the setgid bit is set on the entry.

***

### setuid?

> `optional` **setuid**: `boolean`

Defined in: [index.d.ts:1046](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1046)

`true` if the setuid bit is set on the entry.

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:975](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L975)

The signature (CRC32 checksum) of the content.

***

### sticky?

> `optional` **sticky**: `boolean`

Defined in: [index.d.ts:1054](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1054)

`true` if the sticky bit is set on the entry.

***

### uid?

> `optional` **uid**: `number`

Defined in: [index.d.ts:1034](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1034)

Unix owner id when available.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:935](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L935)

The size of the decompressed data in bytes.

***

### unixExternalUpper?

> `optional` **unixExternalUpper**: `number`

Defined in: [index.d.ts:1071](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1071)

The upper 16-bit portion of [EntryMetaData#externalFileAttributes](#externalfileattributes) when it represents Unix mode bits.

***

### unixMode?

> `optional` **unixMode**: `number`

Defined in: [index.d.ts:1042](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L1042)

Unix mode (st_mode) when available.

***

### version

> **version**: `number`

Defined in: [index.d.ts:991](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L991)

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:995](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L995)

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:987](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L987)

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:927](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L927)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
