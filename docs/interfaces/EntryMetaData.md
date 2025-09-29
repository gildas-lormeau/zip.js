[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Defined in: [index.d.ts:881](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L881)

Represents the metadata of an entry in a zip file (Core API).

## Extended by

- [`DirectoryEntry`](DirectoryEntry.md)
- [`FileEntry`](FileEntry.md)

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:945](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L945)

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:953](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L953)

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:913](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L913)

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1010](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L1010)

The compression method.

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:929](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L929)

The creation date.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1006](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L1006)

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:905](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L905)

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:901](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L901)

`true` if the entry is an executable file

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1002](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L1002)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:989](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L989)

The external file attributes (raw).

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:961](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L961)

The extra field.

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:889](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L889)

The filename of the entry.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:897](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L897)

`true` if the filename is encoded in UTF-8.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:997](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L997)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:985](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L985)

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:925](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L925)

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:921](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L921)

The last modification date.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:981](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L981)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:885](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L885)

The byte offset of the entry.

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:949](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L949)

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:941](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L941)

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:965](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L965)

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:893](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L893)

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:937](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L937)

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:933](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L933)

The last modification date (raw).

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:957](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L957)

The signature (CRC32 checksum) of the content.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:917](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L917)

The size of the decompressed data in bytes.

***

### version

> **version**: `number`

Defined in: [index.d.ts:973](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L973)

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:977](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L977)

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:969](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L969)

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:909](https://github.com/gildas-lormeau/zip.js/blob/02ec02f1298ff2b603f1b86ee545b4d21af7b520/index.d.ts#L909)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
