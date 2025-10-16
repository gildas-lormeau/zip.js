[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / FileEntry

# Interface: FileEntry

Defined in: [index.d.ts:1090](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1090)

Represents the metadata of an entry in a zip file (Core API).

## Extends

- [`EntryMetaData`](EntryMetaData.md)

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:952](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L952)

The comment of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`comment`](EntryMetaData.md#comment)

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:960](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L960)

`true` if the comment is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`commentUTF8`](EntryMetaData.md#commentutf8)

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:920](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L920)

The size of the compressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressedSize`](EntryMetaData.md#compressedsize)

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1081](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1081)

The compression method.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressionMethod`](EntryMetaData.md#compressionmethod)

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:936](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L936)

The creation date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`creationDate`](EntryMetaData.md#creationdate)

***

### directory

> **directory**: `false`

Defined in: [index.d.ts:1094](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1094)

`false` if the entry is a file.

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1077](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1077)

The number of the disk where the entry data starts.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`diskNumberStart`](EntryMetaData.md#disknumberstart)

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:912](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L912)

`true` if the content of the entry is encrypted.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`encrypted`](EntryMetaData.md#encrypted)

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:908](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L908)

`true` if the entry is an executable file

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`executable`](EntryMetaData.md#executable)

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1073](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1073)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttribute`](EntryMetaData.md#externalfileattribute)

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1056](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1056)

The 32-bit `externalFileAttributes` field is the authoritative on-disk metadata for each entry.
- Upper 16 bits: Unix mode/type (e.g., permissions, file type)
- Low 8 bits: MS-DOS file attributes (e.g., directory, read-only)

When writing, all provided options are merged into this field. When reading, convenience fields are decoded from it.
For most use cases, prefer the high-level options and fields; only advanced users need to manipulate the raw value directly.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttributes`](EntryMetaData.md#externalfileattributes)

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:968](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L968)

The extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraField`](EntryMetaData.md#extrafield)

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:896](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L896)

The filename of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filename`](EntryMetaData.md#filename)

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:904](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L904)

`true` if the filename is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameUTF8`](EntryMetaData.md#filenameutf8)

***

### gid?

> `optional` **gid**: `number`

Defined in: [index.d.ts:1027](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1027)

Unix group id when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`gid`](EntryMetaData.md#gid)

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1068](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1068)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](EntryMetaData.md#internalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttribute`](EntryMetaData.md#internalfileattribute)

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1047](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1047)

The internal file attributes (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttributes`](EntryMetaData.md#internalfileattributes)

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:932](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L932)

The last access date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastAccessDate`](EntryMetaData.md#lastaccessdate)

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:928](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L928)

The last modification date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastModDate`](EntryMetaData.md#lastmoddate)

***

### msdosAttributes?

> `optional` **msdosAttributes**: `object`

Defined in: [index.d.ts:1013](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1013)

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

> `optional` **msdosAttributesRaw**: `number`

Defined in: [index.d.ts:1009](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1009)

The MS-DOS attributes low byte (raw).
This is the low 8 bits of [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) when present.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msdosAttributesRaw`](EntryMetaData.md#msdosattributesraw)

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:988](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L988)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msDosCompatible`](EntryMetaData.md#msdoscompatible)

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:892](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L892)

The byte offset of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`offset`](EntryMetaData.md#offset)

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:956](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L956)

The comment of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawComment`](EntryMetaData.md#rawcomment)

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:948](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L948)

The creation date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawCreationDate`](EntryMetaData.md#rawcreationdate)

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:972](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L972)

The extra field (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawExtraField`](EntryMetaData.md#rawextrafield)

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:900](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L900)

The filename of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawFilename`](EntryMetaData.md#rawfilename)

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:944](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L944)

The last access date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastAccessDate`](EntryMetaData.md#rawlastaccessdate)

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:940](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L940)

The last modification date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastModDate`](EntryMetaData.md#rawlastmoddate)

***

### setgid?

> `optional` **setgid**: `boolean`

Defined in: [index.d.ts:1039](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1039)

`true` if the setgid bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`setgid`](EntryMetaData.md#setgid)

***

### setuid?

> `optional` **setuid**: `boolean`

Defined in: [index.d.ts:1035](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1035)

`true` if the setuid bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`setuid`](EntryMetaData.md#setuid)

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:964](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L964)

The signature (CRC32 checksum) of the content.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`signature`](EntryMetaData.md#signature)

***

### sticky?

> `optional` **sticky**: `boolean`

Defined in: [index.d.ts:1043](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1043)

`true` if the sticky bit is set on the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`sticky`](EntryMetaData.md#sticky)

***

### uid?

> `optional` **uid**: `number`

Defined in: [index.d.ts:1023](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1023)

Unix owner id when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uid`](EntryMetaData.md#uid)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:924](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L924)

The size of the decompressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uncompressedSize`](EntryMetaData.md#uncompressedsize)

***

### unixExternalUpper?

> `optional` **unixExternalUpper**: `number`

Defined in: [index.d.ts:1060](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1060)

The upper 16-bit portion of [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) when it represents Unix mode bits.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`unixExternalUpper`](EntryMetaData.md#unixexternalupper)

***

### unixMode?

> `optional` **unixMode**: `number`

Defined in: [index.d.ts:1031](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1031)

Unix mode (st_mode) when available.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`unixMode`](EntryMetaData.md#unixmode)

***

### version

> **version**: `number`

Defined in: [index.d.ts:980](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L980)

The "Version" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`version`](EntryMetaData.md#version)

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:984](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L984)

The "Version made by" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`versionMadeBy`](EntryMetaData.md#versionmadeby)

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:976](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L976)

`true` if the entry is using Zip64.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zip64`](EntryMetaData.md#zip64)

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:916](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L916)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zipCrypto`](EntryMetaData.md#zipcrypto)

## Methods

### arrayBuffer()

> **arrayBuffer**(`options?`): `Promise`\<`ArrayBuffer`\>

Defined in: [index.d.ts:1119](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1119)

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

Defined in: [index.d.ts:1102](https://github.com/gildas-lormeau/zip.js/blob/ade268faf16563c7a33ab45fce2e8761620ea353/index.d.ts#L1102)

Returns the content of the entry

#### Type Parameters

##### Type

`Type`

#### Parameters

##### writer

The [Writer](../classes/Writer.md) instance used to write the content of the entry.

`WritableStream`\<`any`\> | [`WritableWriter`](WritableWriter.md) | `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](WritableWriter.md) \| [`Writer`](../classes/Writer.md)\<`unknown`\>, `boolean`, `any`\> | [`Writer`](../classes/Writer.md)\<`Type`\>

##### options?

[`EntryGetDataCheckPasswordOptions`](EntryGetDataCheckPasswordOptions.md)

The options.

#### Returns

`Promise`\<`Type`\>

A promise resolving to the type to data associated to `writer`.
