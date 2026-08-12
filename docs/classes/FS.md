[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / FS

# Class: FS

Defined in: [index.d.ts:2838](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2838)

## Extends

- `Pick`\<[`ZipDirectoryEntry`](ZipDirectoryEntry.md), `"getChildByName"` \| `"addDirectory"` \| `"addText"` \| `"addBlob"` \| `"addData64URI"` \| `"addUint8Array"` \| `"addHttpContent"` \| `"addReadable"` \| `"addFile"` \| `"addFileSystemEntry"` \| `"addFileSystemHandle"` \| `"importBlob"` \| `"importData64URI"` \| `"importUint8Array"` \| `"importHttpContent"` \| `"importReadable"` \| `"importZip"` \| `"exportBlob"` \| `"exportData64URI"` \| `"exportUint8Array"` \| `"exportWritable"` \| `"exportFileSystemHandle"` \| `"exportZip"` \| `"isPasswordProtected"` \| `"checkPassword"`\>

## Constructors

### Constructor

> **new FS**(): `FS`

#### Returns

`FS`

#### Inherited from

Pick\< ZipDirectoryEntry, \| "getChildByName" \| "addDirectory" \| "addText" \| "addBlob" \| "addData64URI" \| "addUint8Array" \| "addHttpContent" \| "addReadable" \| "addFile" \| "addFileSystemEntry" \| "addFileSystemHandle" \| "importBlob" \| "importData64URI" \| "importUint8Array" \| "importHttpContent" \| "importReadable" \| "importZip" \| "exportBlob" \| "exportData64URI" \| "exportUint8Array" \| "exportWritable" \| "exportFileSystemHandle" \| "exportZip" \| "isPasswordProtected" \| "checkPassword" \>.constructor

## Properties

### children

> `readonly` **children**: [`ZipEntry`](ZipEntry.md)[]

Defined in: [index.d.ts:2880](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2880)

The children of the root directory.

***

### entries

> **entries**: ([`ZipEntry`](ZipEntry.md) \| `null`)[]

Defined in: [index.d.ts:2876](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2876)

The array of all the [ZipEntry](ZipEntry.md) instances indexed by [ZipEntry#id](ZipEntry.md#id).

***

### root

> **root**: [`ZipDirectoryEntry`](ZipDirectoryEntry.md)

Defined in: [index.d.ts:2872](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2872)

The root directory.

## Methods

### addBlob()

> **addBlob**(`name`, `blob`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`Blob`, `Blob`\>

Defined in: [index.d.ts:2565](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2565)

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

> **addData64URI**(`name`, `dataURI`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

Defined in: [index.d.ts:2578](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2578)

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

> **addDirectory**(`name`, `options?`): [`ZipDirectoryEntry`](ZipDirectoryEntry.md)

Defined in: [index.d.ts:2540](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2540)

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

> **addFile**(`file`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)\>

Defined in: [index.d.ts:2629](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2629)

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

> **addFileSystemEntry**(`fileSystemEntry`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

Defined in: [index.d.ts:2637](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2637)

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

> **addFileSystemHandle**(`fileSystemHandle`, `options?`): `Promise`\<[`ZipEntry`](ZipEntry.md)[]\>

Defined in: [index.d.ts:2648](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2648)

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

> **addHttpContent**(`name`, `url`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `void`\>

Defined in: [index.d.ts:2604](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2604)

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

`Pick.addHttpContent`

***

### addReadable()

> **addReadable**(`name`, `readable`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`ReadableStream`\<`any`\>, `void`\>

Defined in: [index.d.ts:2617](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2617)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addReadable`](ZipDirectoryEntry.md#addreadable)

***

### addText()

> **addText**(`name`, `text`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`string`, `string`\>

Defined in: [index.d.ts:2552](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2552)

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

> **addUint8Array**(`name`, `array`, `options?`): [`ZipFileEntry`](ZipFileEntry.md)\<`Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:2591](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2591)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`addUint8Array`](ZipDirectoryEntry.md#adduint8array)

***

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

Defined in: [index.d.ts:2381](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2381)

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

### exportBlob()

> **exportBlob**(`options?`): `Promise`\<`Blob`\>

Defined in: [index.d.ts:2724](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2724)

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

> **exportData64URI**(`options?`): `Promise`\<`string`\>

Defined in: [index.d.ts:2731](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2731)

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

### exportFileSystemHandle()

> **exportFileSystemHandle**(`directoryHandle`, `options?`): `Promise`\<`FileSystemDirectoryHandle`\>

Defined in: [index.d.ts:2759](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2759)

Writes the entry and its descendants into a directory as files and sub-directories via the File System Access API (e.g. the Origin Private File System). Files are streamed and directories are merged into the target; colliding files are overwritten. This is the inverse of [ZipDirectoryEntry#addFileSystemHandle](ZipDirectoryEntry.md#addfilesystemhandle).

#### Parameters

##### directoryHandle

`FileSystemDirectoryHandle`

The target `FileSystemDirectoryHandle` instance.

##### options?

[`ZipDirectoryEntryExportFileSystemHandleOptions`](../interfaces/ZipDirectoryEntryExportFileSystemHandleOptions.md)

The options.

#### Returns

`Promise`\<`FileSystemDirectoryHandle`\>

A promise resolving to the target `FileSystemDirectoryHandle` instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`exportFileSystemHandle`](ZipDirectoryEntry.md#exportfilesystemhandle)

***

### exportUint8Array()

> **exportUint8Array**(`options?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:2738](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2738)

Returns a `Uint8Array` instance containing a zip file of the entry and its descendants

#### Parameters

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A promise resolving to the `Uint8Array` instance.

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`exportUint8Array`](ZipDirectoryEntry.md#exportuint8array)

***

### exportWritable()

> **exportWritable**(`writable?`, `options?`): `Promise`\<`WritableStream`\<`any`\>\>

Defined in: [index.d.ts:2748](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2748)

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

#### Inherited from

[`ZipDirectoryEntry`](ZipDirectoryEntry.md).[`exportWritable`](ZipDirectoryEntry.md#exportwritable)

***

### exportZip()

> **exportZip**(`writer`, `options?`): `Promise`\<`unknown`\>

Defined in: [index.d.ts:2770](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2770)

Creates a zip file via a custom [Writer](Writer.md) instance containing the entry and its descendants

#### Parameters

##### writer

`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\> \| `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `any`, `any`\>

The [Writer](Writer.md) instance.

##### options?

[`ZipDirectoryEntryExportOptions`](../interfaces/ZipDirectoryEntryExportOptions.md)

The options.

#### Returns

`Promise`\<`unknown`\>

A promise resolving to the data.

#### Inherited from

`Pick.exportZip`

***

### find()

> **find**(`fullname`): [`ZipEntry`](ZipEntry.md) \| `undefined`

Defined in: [index.d.ts:2900](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2900)

Returns a [ZipEntry](ZipEntry.md) instance from its full filename

#### Parameters

##### fullname

`string`

The full filename.

#### Returns

[`ZipEntry`](ZipEntry.md) \| `undefined`

The [ZipEntry](ZipEntry.md) instance.

***

### getById()

> **getById**(`id`): [`ZipEntry`](ZipEntry.md) \| `undefined`

Defined in: [index.d.ts:2907](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2907)

Returns a [ZipEntry](ZipEntry.md) instance from the value of [ZipEntry#id](ZipEntry.md#id)

#### Parameters

##### id

`number`

The id of the [ZipEntry](ZipEntry.md) instance.

#### Returns

[`ZipEntry`](ZipEntry.md) \| `undefined`

The [ZipEntry](ZipEntry.md) instance.

***

### getChildByName()

> **getChildByName**(`name`): [`ZipEntry`](ZipEntry.md) \| `undefined`

Defined in: [index.d.ts:2532](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2532)

Gets a [ZipEntry](ZipEntry.md) child instance from its relative filename

#### Parameters

##### name

`string`

The relative filename.

#### Returns

[`ZipEntry`](ZipEntry.md) \| `undefined`

A [ZipFileEntry](ZipFileEntry.md) or a [ZipDirectoryEntry](ZipDirectoryEntry.md) instance (use the [ZipFileEntry#directory](ZipFileEntry.md#directory) and [ZipDirectoryEntry#directory](ZipDirectoryEntry.md#directory) properties to differentiate entries).

#### Inherited from

`Pick.getChildByName`

***

### importBlob()

> **importBlob**(`blob`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2658](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2658)

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

`Pick.importBlob`

***

### importData64URI()

> **importData64URI**(`dataURI`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2668](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2668)

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

`Pick.importData64URI`

***

### importHttpContent()

> **importHttpContent**(`url`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2688](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2688)

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

`Pick.importHttpContent`

***

### importReadable()

> **importReadable**(`readable`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2698](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2698)

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

`Pick.importReadable`

***

### importUint8Array()

> **importUint8Array**(`array`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2678](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2678)

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

`Pick.importUint8Array`

***

### importZip()

> **importZip**(`reader`, `options?`): `Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

Defined in: [index.d.ts:2708](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2708)

Extracts a zip file provided via a custom [Reader](Reader.md) instance into the entry

#### Parameters

##### reader

`ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\> \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[]

The [Reader](Reader.md) instance.

##### options?

[`ZipReaderConstructorOptions`](../interfaces/ZipReaderConstructorOptions.md)

The options.

#### Returns

`Promise`\<\[[`ZipEntry`](ZipEntry.md)\]\>

#### Inherited from

`Pick.importZip`

***

### isPasswordProtected()

> **isPasswordProtected**(): `boolean`

Defined in: [index.d.ts:2377](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2377)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isPasswordProtected`](ZipEntry.md#ispasswordprotected)

***

### move()

> **move**(`entry`, `destination`): `void`

Defined in: [index.d.ts:2893](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2893)

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

Defined in: [index.d.ts:2886](https://github.com/gildas-lormeau/zip.js/blob/7098a57e0b1c6131a5cdca7e2f7570ef2bfa1c95/index.d.ts#L2886)

Removes a [ZipEntry](ZipEntry.md) instance and its children

#### Parameters

##### entry

[`ZipEntry`](ZipEntry.md)

The [ZipEntry](ZipEntry.md) instance to remove.

#### Returns

`void`
