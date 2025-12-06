[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntry

# Class: ZipDirectoryEntry

Defined in: [index.d.ts:1886](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1886)

Represents a directory entry in the zip (Filesystem API).

## Extends

- [`ZipEntry`](ZipEntry.md)

## Extended by

- [`FS`](FS.md)

## Constructors

### Constructor

> **new ZipDirectoryEntry**(): `ZipDirectoryEntry`

#### Returns

`ZipDirectoryEntry`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`constructor`](ZipEntry.md#constructor)

## Properties

### children

> **children**: [`ZipEntry`](ZipEntry.md)[]

Defined in: [index.d.ts:1718](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1718)

The children of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`children`](ZipEntry.md#children)

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:1702](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1702)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`data`](ZipEntry.md#data)

***

### directory

> **directory**: `true`

Defined in: [index.d.ts:1890](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1890)

`true` for  ZipDirectoryEntry instances.

***

### id

> **id**: `number`

Defined in: [index.d.ts:1706](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1706)

The ID of the instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`id`](ZipEntry.md#id)

***

### name

> **name**: `string`

Defined in: [index.d.ts:1698](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1698)

The relative filename of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`name`](ZipEntry.md#name)

***

### parent?

> `optional` **parent**: [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1710](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1710)

The parent directory of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`parent`](ZipEntry.md#parent)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1714](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1714)

The uncompressed size of the content.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`uncompressedSize`](ZipEntry.md#uncompressedsize)

## Methods

### addBlob()

> **addBlob**(`name`, `blob`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`Blob`, `Blob`\>

Defined in: [index.d.ts:1930](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1930)

Adds a entry entry with content provided as a `Blob` instance

#### Parameters

##### name

`string`

The relative filename of the entry.

##### blob

`Blob`

The `Blob` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`Blob`, `Blob`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addData64URI()

> **addData64URI**(`name`, `dataURI`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

Defined in: [index.d.ts:1943](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1943)

Adds a entry entry with content provided as a Data URI `string` encoded in Base64

#### Parameters

##### name

`string`

The relative filename of the entry.

##### dataURI

`string`

The Data URI `string` encoded in Base64.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addDirectory()

> **addDirectory**(`name`, `options?`): `ZipDirectoryEntry`

Defined in: [index.d.ts:1905](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1905)

Adds a directory

#### Parameters

##### name

`string`

The relative filename of the directory.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`ZipDirectoryEntry`

A ZipDirectoryEntry instance.

***

### addFile()

> **addFile**(`file`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)\>

Defined in: [index.d.ts:1994](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1994)

Adds an entry with content provided via a `File` instance

#### Parameters

##### file

`File`

The `File` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`ZipEntry`](ZipEntry.md)\>

A promise resolving to a [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instance.

***

### addFileSystemEntry()

> **addFileSystemEntry**(`fileSystemEntry`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

Defined in: [index.d.ts:2002](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2002)

Adds an entry with content provided via a `FileSystemEntry` instance

#### Parameters

##### fileSystemEntry

[`FileSystemEntryLike`](../interfaces/FileSystemEntryLike.md)

The `FileSystemEntry` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

A promise resolving to an array of [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instances.

***

### addFileSystemHandle()

> **addFileSystemHandle**(`fileSystemHandle`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

Defined in: [index.d.ts:2013](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2013)

Adds an entry with content provided via a `FileSystemHandle` instance

#### Parameters

##### fileSystemHandle

[`FileSystemHandleLike`](../interfaces/FileSystemHandleLike.md)

The `fileSystemHandle` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

`Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

A promise resolving to an array of [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instances.

***

### addHttpContent()

> **addHttpContent**(`name`, `url`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `void`\>

Defined in: [index.d.ts:1969](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1969)

Adds an entry with content fetched from a URL

#### Parameters

##### name

`string`

The relative filename of the entry.

##### url

`string`

The URL.

##### options?

[`HttpOptions`](../interfaces/HttpOptions.md) & [`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`string`, `void`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addReadable()

> **addReadable**(`name`, `readable`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`ReadableStream`\<`any`\>, `void`\>

Defined in: [index.d.ts:1982](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1982)

Adds a entry entry with content provided via a `ReadableStream` instance

#### Parameters

##### name

`string`

The relative filename of the entry.

##### readable

`ReadableStream`

The `ReadableStream` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`ReadableStream`\<`any`\>, `void`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addText()

> **addText**(`name`, `text`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

Defined in: [index.d.ts:1917](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1917)

Adds an entry with content provided as text

#### Parameters

##### name

`string`

The relative filename of the entry.

##### text

`string`

The text.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### addUint8Array()

> **addUint8Array**(`name`, `array`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:1956](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1956)

Adds an entry with content provided as a `Uint8Array` instance

#### Parameters

##### name

`string`

The relative filename of the entry.

##### array

`Uint8Array`

The `Uint8Array` instance.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

A [ZipFileEntry](ZipFileEntry.md) instance.

***

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

Defined in: [index.d.ts:1746](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1746)

Tests the password on the entry and all children if any, returns `true` if the entry is not password protected

#### Parameters

##### password

`string`

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`checkPassword`](ZipEntry.md#checkpassword)

***

### clone()

> **clone**(`deepClone?`): [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1724](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1724)

Clones the entry

#### Parameters

##### deepClone?

`boolean`

`true` to clone all the descendants.

#### Returns

[`ZipEntry`](ZipEntry.md)

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`clone`](ZipEntry.md#clone)

***

### exportBlob()

> **exportBlob**(`options?`): `Promise`\<`Blob`\>

Defined in: [index.d.ts:2089](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2089)

Returns a `Blob` instance containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`Blob`\>

A promise resolving to the `Blob` instance.

***

### exportData64URI()

> **exportData64URI**(`options?`): `Promise`\<`string`\>

Defined in: [index.d.ts:2096](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2096)

Returns a Data URI `string` encoded in Base64 containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`string`\>

A promise resolving to the Data URI `string` encoded in Base64.

***

### exportUint8Array()

> **exportUint8Array**(`options?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:2103](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2103)

Returns a `Uint8Array` instance containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A promise resolving to the `Uint8Array` instance.

***

### exportWritable()

> **exportWritable**(`writable?`, `options?`): `Promise`\<`WritableStream`\<`any`\>\>

Defined in: [index.d.ts:2113](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2113)

Creates a zip file via a `WritableStream` instance containing the entry and its descendants

#### Parameters

##### writable?

`WritableStream`\<`any`\>

The `WritableStream` instance.

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`WritableStream`\<`any`\>\>

A promise resolving to the `Uint8Array` instance.

***

### exportZip()

> **exportZip**(`writer`, `options?`): `Promise`\<`unknown`\>

Defined in: [index.d.ts:2124](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2124)

Creates a zip file via a custom [Writer](Writer.md) instance containing the entry and its descendants

#### Parameters

##### writer

The [Writer](Writer.md) instance.

`WritableStream`\<`any`\> | [`WritableWriter`](../interfaces/WritableWriter.md) | [`Writer`](Writer.md)\<`unknown`\> | `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `any`, `any`\>

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`unknown`\>

A promise resolving to the data.

***

### getChildByName()

> **getChildByName**(`name`): [`ZipEntry`](ZipEntry.md) \| `undefined`

Defined in: [index.d.ts:1897](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1897)

Gets a [ZipEntry](ZipEntry.md) child instance from its relative filename

#### Parameters

##### name

`string`

The relative filename.

#### Returns

[`ZipEntry`](ZipEntry.md) \| `undefined`

A [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instance (use the [ZipFileEntry#directory](ZipFileEntry.md#directory) and [ZipDirectoryEntry#directory](#directory) properties to differentiate entries).

***

### getFullname()

> **getFullname**(): `string`

Defined in: [index.d.ts:1728](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1728)

Returns the full filename of the entry

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getFullname`](ZipEntry.md#getfullname)

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:1732](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1732)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

`ZipDirectoryEntry`

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getRelativeName`](ZipEntry.md#getrelativename)

***

### importBlob()

> **importBlob**(`blob`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2023](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2023)

Extracts a zip file provided as a `Blob` instance into the entry

#### Parameters

##### blob

`Blob`

The `Blob` instance.

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

***

### importData64URI()

> **importData64URI**(`dataURI`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2033](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2033)

Extracts a zip file provided as a Data URI `string` encoded in Base64 into the entry

#### Parameters

##### dataURI

`string`

The Data URI `string` encoded in Base64.

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

***

### importHttpContent()

> **importHttpContent**(`url`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2053](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2053)

Extracts a zip file fetched from a URL into the entry

#### Parameters

##### url

`string`

The URL.

##### options?

[`ZipDirectoryEntryImportHttpOptions`](../interfaces/ZipDirectoryEntryImportHttpOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

***

### importReadable()

> **importReadable**(`readable`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2063](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2063)

Extracts a zip file provided via a `ReadableStream` instance into the entry

#### Parameters

##### readable

`ReadableStream`

The `ReadableStream` instance.

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

***

### importUint8Array()

> **importUint8Array**(`array`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2043](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2043)

Extracts a zip file provided as a `Uint8Array` instance into the entry

#### Parameters

##### array

`Uint8Array`

The `Uint8Array` instance.

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

***

### importZip()

> **importZip**(`reader`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2073](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L2073)

Extracts a zip file provided via a custom [Reader](Reader.md) instance into the entry

#### Parameters

##### reader

The [Reader](Reader.md) instance.

`ReadableStream`\<`any`\> | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\> | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`\<`any`\>[]

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:1738](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1738)

Tests if a ZipDirectoryEntry instance is an ancestor of the entry

#### Parameters

##### ancestor

`ZipDirectoryEntry`

The ZipDirectoryEntry instance.

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isDescendantOf`](ZipEntry.md#isdescendantof)

***

### isPasswordProtected()

> **isPasswordProtected**(): `boolean`

Defined in: [index.d.ts:1742](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1742)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isPasswordProtected`](ZipEntry.md#ispasswordprotected)

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:1755](https://github.com/gildas-lormeau/zip.js/blob/cce2671ac9ac6b49852f46809c21939db1e14fd4/index.d.ts#L1755)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`rename`](ZipEntry.md#rename)
