[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Defined in: [index.d.ts:848](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L848)

Represents the metadata of an entry in a zip file (Core API).

## Extended by

- [`Entry`](Entry.md)

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:916](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L916)

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:924](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L924)

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:884](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L884)

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:981](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L981)

The compression method.

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:900](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L900)

The creation date.

***

### directory

> **directory**: `boolean`

Defined in: [index.d.ts:868](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L868)

`true` if the entry is a directory.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:977](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L977)

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:876](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L876)

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:872](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L872)

`true` if the entry is an executable file

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:973](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L973)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:960](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L960)

The external file attributes (raw).

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:932](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L932)

The extra field.

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:856](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L856)

The filename of the entry.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:864](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L864)

`true` if the filename is encoded in UTF-8.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:968](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L968)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](EntryMetaData.md#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:956](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L956)

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:896](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L896)

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:892](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L892)

The last modification date.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:952](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L952)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:852](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L852)

The byte offset of the entry.

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:920](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L920)

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:912](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L912)

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:936](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L936)

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:860](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L860)

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:908](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L908)

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:904](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L904)

The last modification date (raw).

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:928](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L928)

The signature (CRC32 checksum) of the content.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:888](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L888)

The size of the decompressed data in bytes.

***

### version

> **version**: `number`

Defined in: [index.d.ts:944](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L944)

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:948](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L948)

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:940](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L940)

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:880](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L880)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
