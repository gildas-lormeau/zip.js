[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipDirectoryEntry

# Class: ZipDirectoryEntry

Defined in: [index.d.ts:1875](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1875)

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

Defined in: [index.d.ts:1714](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1714)

The children of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`children`](ZipEntry.md#children)

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:1698](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1698)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`data`](ZipEntry.md#data)

***

### directory

> **directory**: `true`

Defined in: [index.d.ts:1879](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1879)

`true` for  ZipDirectoryEntry instances.

***

### id

> **id**: `number`

Defined in: [index.d.ts:1702](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1702)

The ID of the instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`id`](ZipEntry.md#id)

***

### name

> **name**: `string`

Defined in: [index.d.ts:1694](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1694)

The relative filename of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`name`](ZipEntry.md#name)

***

### parent?

> `optional` **parent**: [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1706](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1706)

The parent directory of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`parent`](ZipEntry.md#parent)

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1710](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1710)

The uncompressed size of the content.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`uncompressedSize`](ZipEntry.md#uncompressedsize)

## Methods

### addBlob()

> **addBlob**(`name`, `blob`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`Blob`, `Blob`\>

Defined in: [index.d.ts:1919](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1919)

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

Defined in: [index.d.ts:1932](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1932)

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

Defined in: [index.d.ts:1894](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1894)

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

Defined in: [index.d.ts:1983](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1983)

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

Defined in: [index.d.ts:1991](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1991)

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

Defined in: [index.d.ts:2002](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2002)

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

Defined in: [index.d.ts:1958](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1958)

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

Defined in: [index.d.ts:1971](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1971)

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

Defined in: [index.d.ts:1906](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1906)

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

Defined in: [index.d.ts:1945](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1945)

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

Defined in: [index.d.ts:1742](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1742)

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

Defined in: [index.d.ts:1720](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1720)

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

Defined in: [index.d.ts:2078](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2078)

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

Defined in: [index.d.ts:2085](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2085)

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

Defined in: [index.d.ts:2092](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2092)

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

Defined in: [index.d.ts:2102](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2102)

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

Defined in: [index.d.ts:2113](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2113)

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

> **getChildByName**(`name`): `undefined` \| [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1886](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1886)

Gets a [ZipEntry](ZipEntry.md) child instance from its relative filename

#### Parameters

##### name

`string`

The relative filename.

#### Returns

`undefined` \| [`ZipEntry`](ZipEntry.md)

A [ZipFileEntry](ZipFileEntry.md) or a ZipDirectoryEntry instance (use the [ZipFileEntry#directory](ZipFileEntry.md#directory) and [ZipDirectoryEntry#directory](#directory) properties to differentiate entries).

***

### getFullname()

> **getFullname**(): `string`

Defined in: [index.d.ts:1724](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1724)

Returns the full filename of the entry

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getFullname`](ZipEntry.md#getfullname)

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:1728](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1728)

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

Defined in: [index.d.ts:2012](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2012)

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

Defined in: [index.d.ts:2022](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2022)

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

Defined in: [index.d.ts:2042](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2042)

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

Defined in: [index.d.ts:2052](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2052)

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

Defined in: [index.d.ts:2032](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2032)

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

Defined in: [index.d.ts:2062](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L2062)

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

Defined in: [index.d.ts:1734](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1734)

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

Defined in: [index.d.ts:1738](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1738)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isPasswordProtected`](ZipEntry.md#ispasswordprotected)

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:1751](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L1751)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`rename`](ZipEntry.md#rename)
