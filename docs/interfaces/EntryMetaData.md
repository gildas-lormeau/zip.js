[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Defined in: [index.d.ts:1014](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1014)

Represents the metadata of an entry in a zip file (Core API).

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:1082](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1082)

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:1090](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1090)

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:1050](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1050)

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1147](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1147)

The compression method.

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1066](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1066)

The creation date.

***

### directory

> **directory**: `boolean`

Defined in: [index.d.ts:1034](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1034)

`true` if the entry is a directory.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1143](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1143)

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1042](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1042)

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:1038](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1038)

`true` if the entry is an executable file

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1139](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1139)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1126](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1126)

The external file attributes (raw).

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:1098](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1098)

The extra field.

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:1022](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1022)

The filename of the entry.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:1030](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1030)

`true` if the filename is encoded in UTF-8.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1134](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1134)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1122](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1122)

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:1062](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1062)

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1058](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1058)

The last modification date.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1118](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1118)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:1018](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1018)

The byte offset of the entry.

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:1086](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1086)

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:1078](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1078)

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1102](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1102)

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:1026](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1026)

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:1074](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1074)

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:1070](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1070)

The last modification date (raw).

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:1094](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1094)

The signature (CRC32 checksum) of the content.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1054](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1054)

The size of the decompressed data in bytes.

***

### version

> **version**: `number`

Defined in: [index.d.ts:1110](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1110)

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:1114](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1114)

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:1106](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1106)

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:1046](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1046)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
