[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / FileEntry

# Interface: FileEntry

Defined in: [index.d.ts:1154](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1154)

## Extends

- `Omit`\<[`EntryMetaData`](EntryMetaData.md), `"directory"`\>

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:1082](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1082)

The comment of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`comment`](EntryMetaData.md#comment)

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:1090](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1090)

`true` if the comment is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`commentUTF8`](EntryMetaData.md#commentutf8)

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:1050](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1050)

The size of the compressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressedSize`](EntryMetaData.md#compressedsize)

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:1147](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1147)

The compression method.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressionMethod`](EntryMetaData.md#compressionmethod)

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:1066](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1066)

The creation date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`creationDate`](EntryMetaData.md#creationdate)

***

### directory

> **directory**: `false`

Defined in: [index.d.ts:1155](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1155)

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:1143](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1143)

The number of the disk where the entry data starts.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`diskNumberStart`](EntryMetaData.md#disknumberstart)

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:1042](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1042)

`true` if the content of the entry is encrypted.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`encrypted`](EntryMetaData.md#encrypted)

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:1038](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1038)

`true` if the entry is an executable file

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`executable`](EntryMetaData.md#executable)

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:1139](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1139)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttribute`](EntryMetaData.md#externalfileattribute)

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:1126](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1126)

The external file attributes (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttributes`](EntryMetaData.md#externalfileattributes)

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`; `type`: `number`; \}\>

Defined in: [index.d.ts:1098](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1098)

The extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraField`](EntryMetaData.md#extrafield)

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:1022](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1022)

The filename of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filename`](EntryMetaData.md#filename)

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:1030](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1030)

`true` if the filename is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameUTF8`](EntryMetaData.md#filenameutf8)

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:1134](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1134)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](EntryMetaData.md#internalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttribute`](EntryMetaData.md#internalfileattribute)

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:1122](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1122)

The internal file attributes (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttributes`](EntryMetaData.md#internalfileattributes)

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:1062](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1062)

The last access date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastAccessDate`](EntryMetaData.md#lastaccessdate)

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:1058](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1058)

The last modification date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastModDate`](EntryMetaData.md#lastmoddate)

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:1118](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1118)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msDosCompatible`](EntryMetaData.md#msdoscompatible)

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:1018](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1018)

The byte offset of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`offset`](EntryMetaData.md#offset)

***

### rawComment

> **rawComment**: `Uint8Array`

Defined in: [index.d.ts:1086](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1086)

The comment of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawComment`](EntryMetaData.md#rawcomment)

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:1078](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1078)

The creation date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawCreationDate`](EntryMetaData.md#rawcreationdate)

***

### rawExtraField

> **rawExtraField**: `Uint8Array`

Defined in: [index.d.ts:1102](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1102)

The extra field (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawExtraField`](EntryMetaData.md#rawextrafield)

***

### rawFilename

> **rawFilename**: `Uint8Array`

Defined in: [index.d.ts:1026](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1026)

The filename of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawFilename`](EntryMetaData.md#rawfilename)

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:1074](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1074)

The last access date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastAccessDate`](EntryMetaData.md#rawlastaccessdate)

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:1070](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1070)

The last modification date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastModDate`](EntryMetaData.md#rawlastmoddate)

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:1094](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1094)

The signature (CRC32 checksum) of the content.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`signature`](EntryMetaData.md#signature)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1054](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1054)

The size of the decompressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uncompressedSize`](EntryMetaData.md#uncompressedsize)

***

### version

> **version**: `number`

Defined in: [index.d.ts:1110](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1110)

The "Version" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`version`](EntryMetaData.md#version)

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:1114](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1114)

The "Version made by" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`versionMadeBy`](EntryMetaData.md#versionmadeby)

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:1106](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1106)

`true` if the entry is using Zip64.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zip64`](EntryMetaData.md#zip64)

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:1046](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1046)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zipCrypto`](EntryMetaData.md#zipcrypto)

## Methods

### arrayBuffer()

> **arrayBuffer**(`options?`): `Promise`\<`ArrayBuffer`\>

Defined in: [index.d.ts:1180](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1180)

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

Defined in: [index.d.ts:1163](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L1163)

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
