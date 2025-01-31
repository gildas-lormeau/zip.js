[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / FS

# Class: FS

Defined in: [index.d.ts:1947](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1947)

Represents a Filesystem instance.

## Example

Here is an example showing how to create and read a zip file containing a compressed text file:
```
const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });
let zipFs = new zip.fs.FS();
zipFs.addBlob("lorem.txt", BLOB);
const zippedBlob = await zipFs.exportBlob();
zipFs = new zip.fs.FS();
await zipFs.importBlob(zippedBlob);
const firstEntry = zipFs.children[0];
const unzippedBlob = await firstEntry.getBlob(zip.getMimeType(firstEntry.name));
```

## Extends

- [`ZipDirectoryEntry`](ZipDirectoryEntry.md)

## Constructors

### new FS()

> **new FS**(): [`FS`](FS.md)

#### Returns

[`FS`](FS.md)

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`constructor`](ZipDirectoryEntry.md#constructors)

## Properties

### children

> **children**: [`ZipEntry`](ZipEntry.md)[]

Defined in: [index.d.ts:1492](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1492)

The children of the entry.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`children`](ZipDirectoryEntry.md#children)

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:1476](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1476)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`data`](ZipDirectoryEntry.md#data)

***

### directory

> **directory**: `true`

Defined in: [index.d.ts:1657](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1657)

`true` for  [ZipDirectoryEntry](ZipDirectoryEntry.md) instances.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`directory`](ZipDirectoryEntry.md#directory)

***

### id

> **id**: `number`

Defined in: [index.d.ts:1480](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1480)

The ID of the instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`id`](ZipDirectoryEntry.md#id)

***

### name

> **name**: `string`

Defined in: [index.d.ts:1472](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1472)

The relative filename of the entry.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`name`](ZipDirectoryEntry.md#name)

***

### parent?

> `optional` **parent**: [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1484](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1484)

The parent directory of the entry.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`parent`](ZipDirectoryEntry.md#parent)

***

### root

> **root**: [`ZipDirectoryEntry`](ZipDirectoryEntry.md)

Defined in: [index.d.ts:1951](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1951)

The root directory.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:1488](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1488)

The uncompressed size of the content.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`uncompressedSize`](ZipDirectoryEntry.md#uncompressedsize)

## Methods

### addBlob()

> **addBlob**(`name`, `blob`, `options`?): [`ZipFileEntry`](ZipFileEntry.md)\<`Blob`, `Blob`\>

Defined in: [index.d.ts:1697](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1697)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addBlob`](ZipDirectoryEntry.md#addblob)

***

### addData64URI()

> **addData64URI**(`name`, `dataURI`, `options`?): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

Defined in: [index.d.ts:1710](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1710)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addData64URI`](ZipDirectoryEntry.md#adddata64uri)

***

### addDirectory()

> **addDirectory**(`name`, `options`?): [`ZipDirectoryEntry`](ZipDirectoryEntry.md)

Defined in: [index.d.ts:1672](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1672)

Adds a directory

#### Parameters

##### name

`string`

The relative filename of the directory.

##### options?

[`ZipWriterAddDataOptions`](../interfaces/ZipWriterAddDataOptions.md)

The options.

#### Returns

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

A [ZipDirectoryEntry](ZipDirectoryEntry.md) instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addDirectory`](ZipDirectoryEntry.md#adddirectory)

***

### addFile()

> **addFile**(`file`, `options`?): `Promise`\<[`ZipEntry`](ZipEntry.md)\>

Defined in: [index.d.ts:1761](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1761)

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

A promise resolving to a [ZipFileEntry](ZipFileEntry.md) or a [ZipDirectoryEntry](ZipDirectoryEntry.md) instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addFile`](ZipDirectoryEntry.md#addfile)

***

### addFileSystemEntry()

> **addFileSystemEntry**(`fileSystemEntry`, `options`?): `Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

Defined in: [index.d.ts:1772](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1772)

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

A promise resolving to an array of [ZipFileEntry](ZipFileEntry.md) or a [ZipDirectoryEntry](ZipDirectoryEntry.md) instances.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addFileSystemEntry`](ZipDirectoryEntry.md#addfilesystementry)

***

### addFileSystemHandle()

> **addFileSystemHandle**(`fileSystemHandle`, `options`?): `Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

Defined in: [index.d.ts:1783](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1783)

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

A promise resolving to an array of [ZipFileEntry](ZipFileEntry.md) or a [ZipDirectoryEntry](ZipDirectoryEntry.md) instances.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addFileSystemHandle`](ZipDirectoryEntry.md#addfilesystemhandle)

***

### addHttpContent()

> **addHttpContent**(`name`, `url`, `options`?): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `void`\>

Defined in: [index.d.ts:1736](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1736)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addHttpContent`](ZipDirectoryEntry.md#addhttpcontent)

***

### addReadable()

> **addReadable**(`name`, `readable`, `options`?): [`ZipFileEntry`](ZipFileEntry.md)\<`ReadableStream`, `void`\>

Defined in: [index.d.ts:1749](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1749)

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

[`ZipFileEntry`](ZipFileEntry.md)\<`ReadableStream`, `void`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addReadable`](ZipDirectoryEntry.md#addreadable)

***

### addText()

> **addText**(`name`, `text`, `options`?): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

Defined in: [index.d.ts:1684](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1684)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addText`](ZipDirectoryEntry.md#addtext)

***

### addUint8Array()

> **addUint8Array**(`name`, `array`, `options`?): [`ZipFileEntry`](ZipFileEntry.md)\<`Uint8Array`, `Uint8Array`\>

Defined in: [index.d.ts:1723](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1723)

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

[`ZipFileEntry`](ZipFileEntry.md)\<`Uint8Array`, `Uint8Array`\>

A [ZipFileEntry](ZipFileEntry.md) instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addUint8Array`](ZipDirectoryEntry.md#adduint8array)

***

### checkPassword()

> **checkPassword**(`password`, `options`?): `Promise`\<`boolean`\>

Defined in: [index.d.ts:1520](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1520)

Tests the password on the entry and all children if any, returns `true` if the entry is not password protected

#### Parameters

##### password

`string`

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`checkPassword`](ZipDirectoryEntry.md#checkpassword)

***

### clone()

> **clone**(`deepClone`?): [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1498](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1498)

Clones the entry

#### Parameters

##### deepClone?

`boolean`

`true` to clone all the descendants.

#### Returns

[`ZipEntry`](ZipEntry.md)

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`clone`](ZipDirectoryEntry.md#clone)

***

### exportBlob()

> **exportBlob**(`options`?): `Promise`\<`Blob`\>

Defined in: [index.d.ts:1859](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1859)

Returns a `Blob` instance containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`Blob`\>

A promise resolving to the `Blob` instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`exportBlob`](ZipDirectoryEntry.md#exportblob)

***

### exportData64URI()

> **exportData64URI**(`options`?): `Promise`\<`string`\>

Defined in: [index.d.ts:1866](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1866)

Returns a Data URI `string` encoded in Base64 containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`string`\>

A promise resolving to the Data URI `string` encoded in Base64.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`exportData64URI`](ZipDirectoryEntry.md#exportdata64uri)

***

### exportUint8Array()

> **exportUint8Array**(`options`?): `Promise`\<`Uint8Array`\>

Defined in: [index.d.ts:1873](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1873)

Returns a `Uint8Array` instance containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`Uint8Array`\>

A promise resolving to the `Uint8Array` instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`exportUint8Array`](ZipDirectoryEntry.md#exportuint8array)

***

### exportWritable()

> **exportWritable**(`writable`?, `options`?): `Promise`\<`WritableStream`\>

Defined in: [index.d.ts:1883](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1883)

Creates a zip file via a `WritableStream` instance containing the entry and its descendants

#### Parameters

##### writable?

`WritableStream`

The `WritableStream` instance.

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`WritableStream`\>

A promise resolving to the `Uint8Array` instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`exportWritable`](ZipDirectoryEntry.md#exportwritable)

***

### exportZip()

> **exportZip**(`writer`, `options`?): `Promise`\<`unknown`\>

Defined in: [index.d.ts:1894](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1894)

Creates a zip file via a custom [Writer](Writer.md) instance containing the entry and its descendants

#### Parameters

##### writer

The [Writer](Writer.md) instance.

`WritableStream` | [`WritableWriter`](../interfaces/WritableWriter.md) | [`Writer`](Writer.md)\<`unknown`\> | `AsyncGenerator`\<`WritableStream` \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>\>

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`unknown`\>

A promise resolving to the data.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`exportZip`](ZipDirectoryEntry.md#exportzip)

***

### find()

> **find**(`fullname`): [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1971](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1971)

Returns a [ZipEntry](ZipEntry.md) instance from its full filename

#### Parameters

##### fullname

`string`

The full filename.

#### Returns

[`ZipEntry`](ZipEntry.md)

The [ZipEntry](ZipEntry.md) instance.

***

### getById()

> **getById**(`id`): [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1978](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1978)

Returns a [ZipEntry](ZipEntry.md) instance from the value of [ZipEntry#id](ZipEntry.md#id)

#### Parameters

##### id

`number`

The id of the [ZipEntry](ZipEntry.md) instance.

#### Returns

[`ZipEntry`](ZipEntry.md)

The [ZipEntry](ZipEntry.md) instance.

***

### getChildByName()

> **getChildByName**(`name`): [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:1664](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1664)

Gets a [ZipEntry](ZipEntry.md) child instance from its relative filename

#### Parameters

##### name

`string`

The relative filename.

#### Returns

[`ZipEntry`](ZipEntry.md)

A [ZipFileEntry](ZipFileEntry.md) or a [ZipDirectoryEntry](ZipDirectoryEntry.md) instance (use the [ZipFileEntry#directory](ZipFileEntry.md#directory) and [ZipDirectoryEntry#directory](ZipDirectoryEntry.md#directory) properties to differentiate entries).

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`getChildByName`](ZipDirectoryEntry.md#getchildbyname)

***

### getFullname()

> **getFullname**(): `string`

Defined in: [index.d.ts:1502](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1502)

Returns the full filename of the entry

#### Returns

`string`

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`getFullname`](ZipDirectoryEntry.md#getfullname)

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:1506](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1506)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`getRelativeName`](ZipDirectoryEntry.md#getrelativename)

***

### importBlob()

> **importBlob**(`blob`, `options`?): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:1793](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1793)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`importBlob`](ZipDirectoryEntry.md#importblob)

***

### importData64URI()

> **importData64URI**(`dataURI`, `options`?): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:1803](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1803)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`importData64URI`](ZipDirectoryEntry.md#importdata64uri)

***

### importHttpContent()

> **importHttpContent**(`url`, `options`?): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:1823](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1823)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`importHttpContent`](ZipDirectoryEntry.md#importhttpcontent)

***

### importReadable()

> **importReadable**(`readable`, `options`?): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:1833](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1833)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`importReadable`](ZipDirectoryEntry.md#importreadable)

***

### importUint8Array()

> **importUint8Array**(`array`, `options`?): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:1813](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1813)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`importUint8Array`](ZipDirectoryEntry.md#importuint8array)

***

### importZip()

> **importZip**(`reader`, `options`?): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:1843](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1843)

Extracts a zip file provided via a custom [Reader](Reader.md) instance into the entry

#### Parameters

##### reader

The [Reader](Reader.md) instance.

`ReadableStream` | [`ReadableReader`](../interfaces/ReadableReader.md) | [`Reader`](Reader.md)\<`unknown`\> | [`Reader`](Reader.md)\<`unknown`\>[] | [`ReadableReader`](../interfaces/ReadableReader.md)[] | `ReadableStream`[]

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`importZip`](ZipDirectoryEntry.md#importzip)

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:1512](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1512)

Tests if a [ZipDirectoryEntry](ZipDirectoryEntry.md) instance is an ancestor of the entry

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

The [ZipDirectoryEntry](ZipDirectoryEntry.md) instance.

#### Returns

`boolean`

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`isDescendantOf`](ZipDirectoryEntry.md#isdescendantof)

***

### isPasswordProtected()

> **isPasswordProtected**(): `boolean`

Defined in: [index.d.ts:1516](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1516)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`isPasswordProtected`](ZipDirectoryEntry.md#ispasswordprotected)

***

### move()

> **move**(`entry`, `destination`): `void`

Defined in: [index.d.ts:1964](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1964)

Moves a [ZipEntry](ZipEntry.md) instance and its children into a [ZipDirectoryEntry](ZipDirectoryEntry.md) instance

#### Parameters

##### entry

[`ZipEntry`](ZipEntry.md)

The [ZipEntry](ZipEntry.md) instance to move.

##### destination

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

The [ZipDirectoryEntry](ZipDirectoryEntry.md) instance.

#### Returns

`void`

***

### remove()

> **remove**(`entry`): `void`

Defined in: [index.d.ts:1957](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1957)

Removes a [ZipEntry](ZipEntry.md) instance and its children

#### Parameters

##### entry

[`ZipEntry`](ZipEntry.md)

The [ZipEntry](ZipEntry.md) instance to remove.

#### Returns

`void`

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:1529](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L1529)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`rename`](ZipDirectoryEntry.md#rename)
