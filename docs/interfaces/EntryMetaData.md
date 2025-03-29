[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Defined in: [index.d.ts:843](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L843)

Represents the metadata of an entry in a zip file (Core API).

## Extended by

- [`Entry`](Entry.md)

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:911](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L911)

The comment of the entry.

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:919](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L919)

`true` if the comment is encoded in UTF-8.

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:879](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L879)

The size of the compressed data in bytes.

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:976](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L976)

The compression method.

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:895](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L895)

The creation date.

***

### directory

> **directory**: `boolean`

Defined in: [index.d.ts:863](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L863)

`true` if the entry is a directory.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:972](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L972)

The number of the disk where the entry data starts.

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:871](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L871)

`true` if the content of the entry is encrypted.

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:867](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L867)

`true` if the entry is an executable file

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:968](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L968)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](#externalfileattributes) instead.

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:955](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L955)

The external file attributes (raw).

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`\<`ArrayBuffer`\>; `type`: `number`; \}\>

Defined in: [index.d.ts:927](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L927)

The extra field.

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:851](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L851)

The filename of the entry.

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:859](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L859)

`true` if the filename is encoded in UTF-8.

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:963](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L963)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](#internalfileattributes) instead.

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:951](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L951)

The internal file attributes (raw).

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:891](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L891)

The last access date.

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:887](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L887)

The last modification date.

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:947](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L947)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:847](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L847)

The byte offset of the entry.

***

### rawComment

> **rawComment**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:915](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L915)

The comment of the entry (raw).

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:907](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L907)

The creation date (raw).

***

### rawExtraField

> **rawExtraField**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:931](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L931)

The extra field (raw).

***

### rawFilename

> **rawFilename**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:855](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L855)

The filename of the entry (raw).

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:903](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L903)

The last access date (raw).

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:899](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L899)

The last modification date (raw).

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:923](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L923)

The signature (CRC32 checksum) of the content.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:883](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L883)

The size of the decompressed data in bytes.

***

### version

> **version**: `number`

Defined in: [index.d.ts:939](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L939)

The "Version" field.

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:943](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L943)

The "Version made by" field.

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:935](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L935)

`true` if the entry is using Zip64.

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:875](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L875)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.
