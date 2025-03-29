[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Entry

# Interface: Entry

Defined in: [index.d.ts:982](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L982)

Represents an entry with its data and metadata in a zip file (Core API).

## Extends

- [`EntryMetaData`](EntryMetaData.md)

## Properties

### comment

> **comment**: `string`

Defined in: [index.d.ts:911](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L911)

The comment of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`comment`](EntryMetaData.md#comment)

***

### commentUTF8

> **commentUTF8**: `boolean`

Defined in: [index.d.ts:919](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L919)

`true` if the comment is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`commentUTF8`](EntryMetaData.md#commentutf8)

***

### compressedSize

> **compressedSize**: `number`

Defined in: [index.d.ts:879](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L879)

The size of the compressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressedSize`](EntryMetaData.md#compressedsize)

***

### compressionMethod

> **compressionMethod**: `number`

Defined in: [index.d.ts:976](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L976)

The compression method.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`compressionMethod`](EntryMetaData.md#compressionmethod)

***

### creationDate?

> `optional` **creationDate**: `Date`

Defined in: [index.d.ts:895](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L895)

The creation date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`creationDate`](EntryMetaData.md#creationdate)

***

### directory

> **directory**: `boolean`

Defined in: [index.d.ts:863](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L863)

`true` if the entry is a directory.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`directory`](EntryMetaData.md#directory)

***

### diskNumberStart

> **diskNumberStart**: `number`

Defined in: [index.d.ts:972](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L972)

The number of the disk where the entry data starts.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`diskNumberStart`](EntryMetaData.md#disknumberstart)

***

### encrypted

> **encrypted**: `boolean`

Defined in: [index.d.ts:871](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L871)

`true` if the content of the entry is encrypted.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`encrypted`](EntryMetaData.md#encrypted)

***

### executable

> **executable**: `boolean`

Defined in: [index.d.ts:867](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L867)

`true` if the entry is an executable file

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`executable`](EntryMetaData.md#executable)

***

### ~~externalFileAttribute~~

> **externalFileAttribute**: `number`

Defined in: [index.d.ts:968](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L968)

The external file attribute (raw).

#### Deprecated

Use [EntryMetaData#externalFileAttributes](EntryMetaData.md#externalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttribute`](EntryMetaData.md#externalfileattribute)

***

### externalFileAttributes

> **externalFileAttributes**: `number`

Defined in: [index.d.ts:955](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L955)

The external file attributes (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`externalFileAttributes`](EntryMetaData.md#externalfileattributes)

***

### extraField?

> `optional` **extraField**: `Map`\<`number`, \{ `data`: `Uint8Array`\<`ArrayBuffer`\>; `type`: `number`; \}\>

Defined in: [index.d.ts:927](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L927)

The extra field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`extraField`](EntryMetaData.md#extrafield)

***

### filename

> **filename**: `string`

Defined in: [index.d.ts:851](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L851)

The filename of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filename`](EntryMetaData.md#filename)

***

### filenameUTF8

> **filenameUTF8**: `boolean`

Defined in: [index.d.ts:859](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L859)

`true` if the filename is encoded in UTF-8.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`filenameUTF8`](EntryMetaData.md#filenameutf8)

***

### ~~internalFileAttribute~~

> **internalFileAttribute**: `number`

Defined in: [index.d.ts:963](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L963)

The internal file attribute (raw).

#### Deprecated

Use [EntryMetaData#internalFileAttributes](EntryMetaData.md#internalfileattributes) instead.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttribute`](EntryMetaData.md#internalfileattribute)

***

### internalFileAttributes

> **internalFileAttributes**: `number`

Defined in: [index.d.ts:951](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L951)

The internal file attributes (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`internalFileAttributes`](EntryMetaData.md#internalfileattributes)

***

### lastAccessDate?

> `optional` **lastAccessDate**: `Date`

Defined in: [index.d.ts:891](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L891)

The last access date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastAccessDate`](EntryMetaData.md#lastaccessdate)

***

### lastModDate

> **lastModDate**: `Date`

Defined in: [index.d.ts:887](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L887)

The last modification date.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`lastModDate`](EntryMetaData.md#lastmoddate)

***

### msDosCompatible

> **msDosCompatible**: `boolean`

Defined in: [index.d.ts:947](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L947)

`true` if `internalFileAttributes` and `externalFileAttributes` are compatible with MS-DOS format.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`msDosCompatible`](EntryMetaData.md#msdoscompatible)

***

### offset

> **offset**: `number`

Defined in: [index.d.ts:847](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L847)

The byte offset of the entry.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`offset`](EntryMetaData.md#offset)

***

### rawComment

> **rawComment**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:915](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L915)

The comment of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawComment`](EntryMetaData.md#rawcomment)

***

### rawCreationDate?

> `optional` **rawCreationDate**: `number` \| `bigint`

Defined in: [index.d.ts:907](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L907)

The creation date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawCreationDate`](EntryMetaData.md#rawcreationdate)

***

### rawExtraField

> **rawExtraField**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:931](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L931)

The extra field (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawExtraField`](EntryMetaData.md#rawextrafield)

***

### rawFilename

> **rawFilename**: `Uint8Array`\<`ArrayBuffer`\>

Defined in: [index.d.ts:855](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L855)

The filename of the entry (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawFilename`](EntryMetaData.md#rawfilename)

***

### rawLastAccessDate?

> `optional` **rawLastAccessDate**: `number` \| `bigint`

Defined in: [index.d.ts:903](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L903)

The last access date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastAccessDate`](EntryMetaData.md#rawlastaccessdate)

***

### rawLastModDate

> **rawLastModDate**: `number` \| `bigint`

Defined in: [index.d.ts:899](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L899)

The last modification date (raw).

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`rawLastModDate`](EntryMetaData.md#rawlastmoddate)

***

### signature

> **signature**: `number`

Defined in: [index.d.ts:923](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L923)

The signature (CRC32 checksum) of the content.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`signature`](EntryMetaData.md#signature)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:883](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L883)

The size of the decompressed data in bytes.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`uncompressedSize`](EntryMetaData.md#uncompressedsize)

***

### version

> **version**: `number`

Defined in: [index.d.ts:939](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L939)

The "Version" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`version`](EntryMetaData.md#version)

***

### versionMadeBy

> **versionMadeBy**: `number`

Defined in: [index.d.ts:943](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L943)

The "Version made by" field.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`versionMadeBy`](EntryMetaData.md#versionmadeby)

***

### zip64

> **zip64**: `boolean`

Defined in: [index.d.ts:935](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L935)

`true` if the entry is using Zip64.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zip64`](EntryMetaData.md#zip64)

***

### zipCrypto

> **zipCrypto**: `boolean`

Defined in: [index.d.ts:875](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L875)

`true` if the content of the entry is encrypted with the ZipCrypto algorithm.

#### Inherited from

[`EntryMetaData`](EntryMetaData.md).[`zipCrypto`](EntryMetaData.md#zipcrypto)

## Methods

### getData()?

> `optional` **getData**\<`Type`\>(`writer`, `options`?): `Promise`\<`Type`\>

Defined in: [index.d.ts:990](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L990)

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
