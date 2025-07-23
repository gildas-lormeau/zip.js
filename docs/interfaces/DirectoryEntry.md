[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / DirectoryEntry

# Interface: DirectoryEntry

Defined in: [index.d.ts:1147](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1147)

## Extends

- `Omit`\<[`EntryMetaData`](EntryMetaData.md), `"directory"`\>

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:1080](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1080)

The comment of the entry.

#### Inherited from

`Omit.comment`

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:1088](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1088)

`true` if the comment is encoded in UTF-8.

#### Inherited from

`Omit.commentUTF8`

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:1048](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1048)

The size of the compressed data in bytes.

#### Inherited from

`Omit.compressedSize`

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1145](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1145)

The compression method.

#### Inherited from

`Omit.compressionMethod`

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1064](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1064)

The creation date.

#### Inherited from

`Omit.creationDate`

***

### directory

> **directory**: `true`

Defined in: [index.d.ts:1148](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1148)

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1141](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1141)

The number of the disk where the entry data starts.

#### Inherited from

`Omit.diskNumberStart`

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1040](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1040)

`true` if the content of the entry is encrypted.

#### Inherited from

`Omit.encrypted`

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:1036](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1036)

`true` if the entry is an executable file

#### Inherited from

`Omit.executable`

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1137](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1137)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) instead.

#### Inherited from

`Omit.externalFileAttribute`

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1124](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1124)

The external file attributes (raw).

#### Inherited from

`Omit.externalFileAttributes`

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:1096](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1096)

The extra field.

#### Inherited from

`Omit.extraField`

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:1020](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1020)

The filename of the entry.

#### Inherited from

`Omit.filename`

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:1028](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1028)

`true` if the filename is encoded in UTF-8.

#### Inherited from

`Omit.filenameUTF8`

***

### getData?

> `optional` **getData**: `undefined`

Defined in: [index.d.ts:1149](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1149)

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1132](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1132)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](EntryMetaData.md#internalfileattributes) instead.

#### Inherited from

`Omit.internalFileAttribute`

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1120](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1120)

The internal file attributes (raw).

#### Inherited from

`Omit.internalFileAttributes`

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:1060](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1060)

The last access date.

#### Inherited from

`Omit.lastAccessDate`

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1056](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1056)

The last modification date.

#### Inherited from

`Omit.lastModDate`

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1116](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1116)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

#### Inherited from

`Omit.msDosCompatible`

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:1016](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1016)

The byte offset of the entry.

#### Inherited from

`Omit.offset`

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:1084](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1084)

The comment of the entry (raw).

#### Inherited from

`Omit.rawComment`

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:1076](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1076)

The creation date (raw).

#### Inherited from

`Omit.rawCreationDate`

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1100](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1100)

The extra field (raw).

#### Inherited from

`Omit.rawExtraField`

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:1024](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1024)

The filename of the entry (raw).

#### Inherited from

`Omit.rawFilename`

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:1072](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1072)

The last access date (raw).

#### Inherited from

`Omit.rawLastAccessDate`

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:1068](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1068)

The last modification date (raw).

#### Inherited from

`Omit.rawLastModDate`

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:1092](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1092)

The signature (CRC32 checksum) of the content.

#### Inherited from

`Omit.signature`

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1052](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1052)

The size of the decompressed data in bytes.

#### Inherited from

`Omit.uncompressedSize`

***

### version

> **version**: `number`

Defined in: [index.d.ts:1108](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1108)

The "Version" field.

#### Inherited from

`Omit.version`

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:1112](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1112)

The "Version made by" field.

#### Inherited from

`Omit.versionMadeBy`

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:1104](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1104)

`true` if the entry is using Zip64.

#### Inherited from

`Omit.zip64`

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:1044](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L1044)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.

#### Inherited from

`Omit.zipCrypto`
