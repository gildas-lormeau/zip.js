[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / EntryMetaData

# Interface: EntryMetaData

Represents the metadata of an entry in a zip file (Core API).

## Extended by

- [`Entry`](Entry.md)

## Properties

### comment

> **comment**: `string`

The comment of the entry.

#### Defined in

[index.d.ts:912](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L912)

***

### commentUTF8

> **commentUTF8**: `boolean`

`true` if the comment is encoded in UTF-8.

#### Defined in

[index.d.ts:920](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L920)

***

### compressedSize

> **compressedSize**: `number`

The size of the compressed data in bytes.

#### Defined in

[index.d.ts:880](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L880)

***

### compressionMethod

> **compressionMethod**: `number`

The compression method.

#### Defined in

[index.d.ts:964](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L964)

***

### creationDate?

> `optional` **creationDate**: `Date`

The creation date.

#### Defined in

[index.d.ts:896](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L896)

***

### directory

> **directory**: `boolean`

`true` if the entry is a directory.

#### Defined in

[index.d.ts:868](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L868)

***

### diskNumberStart

> **diskNumberStart**: `number`

The number of the disk where the entry data starts.

#### Defined in

[index.d.ts:960](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L960)

***

### encrypted

> **encrypted**: `boolean`

`true` if the content of the entry is encrypted.

#### Defined in

[index.d.ts:872](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L872)

***

### externalFileAttribute

> **externalFileAttribute**: `number`

The external file attribute (raw).

#### Defined in

[index.d.ts:956](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L956)

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`\<`ArrayBufferLike`\>; `type`: `number`; \}\>

The extra field.

#### Defined in

[index.d.ts:928](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L928)

***

### filename

> **filename**: `string`

The filename of the entry.

#### Defined in

[index.d.ts:856](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L856)

***

### filenameUTF8

> **filenameUTF8**: `boolean`

`true` if the filename is encoded in UTF-8.

#### Defined in

[index.d.ts:864](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L864)

***

### internalFileAttribute

> **internalFileAttribute**: `number`

The internal file attribute (raw).

#### Defined in

[index.d.ts:952](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L952)

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

The last access date.

#### Defined in

[index.d.ts:892](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L892)

***

### lastModDate

> **lastModDate**: `Date`

The last modification date.

#### Defined in

[index.d.ts:888](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L888)

***

### msDosCompatible

> **msDosCompatible**: `boolean`

`true` if `internalFileAttribute` and `externalFileAttribute` are compatible with MS-DOS format.

#### Defined in

[index.d.ts:948](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L948)

***

### offset

> **offset**: `number`

The byte offset of the entry.

#### Defined in

[index.d.ts:852](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L852)

***

### rawComment

> **rawComment**: `Uint8Array`\<`ArrayBufferLike`\>

The comment of the entry (raw).

#### Defined in

[index.d.ts:916](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L916)

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

The creation date (raw).

#### Defined in

[index.d.ts:908](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L908)

***

### rawExtraField

> **rawExtraField**: `Uint8Array`\<`ArrayBufferLike`\>

The extra field (raw).

#### Defined in

[index.d.ts:932](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L932)

***

### rawFilename

> **rawFilename**: `Uint8Array`\<`ArrayBufferLike`\>

The filename of the entry (raw).

#### Defined in

[index.d.ts:860](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L860)

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

The last access date (raw).

#### Defined in

[index.d.ts:904](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L904)

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

The last modification date (raw).

#### Defined in

[index.d.ts:900](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L900)

***

### signature

> **signature**: `number`

The signature (CRC32 checksum) of the content.

#### Defined in

[index.d.ts:924](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L924)

***

### uncompressedSize

> **uncompressedSize**: `number`

The size of the decompressed data in bytes.

#### Defined in

[index.d.ts:884](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L884)

***

### version

> **version**: `number`

The "Version" field.

#### Defined in

[index.d.ts:940](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L940)

***

### versionMadeBy

> **versionMadeBy**: `number`

The "Version made by" field.

#### Defined in

[index.d.ts:944](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L944)

***

### zip64

> **zip64**: `boolean`

`true` if the entry is using Zip64.

#### Defined in

[index.d.ts:936](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L936)

***

### zipCrypto

> **zipCrypto**: `boolean`

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.

#### Defined in

[index.d.ts:876](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L876)
