[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipFileEntry

# Class: ZipFileEntry\<ReaderType, WriterType\>

Represents a file entry in the zip (Filesystem API).

## Extends

- [`ZipEntry`](ZipEntry.md)

## Type Parameters

• **ReaderType**

• **WriterType**

## Constructors

### new ZipFileEntry()

> **new ZipFileEntry**\<`ReaderType`, `WriterType`\>(): [`ZipFileEntry`](ZipFileEntry.md)\<`ReaderType`, `WriterType`\>

#### Returns

[`ZipFileEntry`](ZipFileEntry.md)\<`ReaderType`, `WriterType`\>

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`constructor`](ZipEntry.md#constructors)

## Properties

### children

> **children**: [`ZipEntry`](ZipEntry.md)[]

The children of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`children`](ZipEntry.md#children)

#### Defined in

[index.d.ts:1469](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1469)

***

### data?

> `optional` **data**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`data`](ZipEntry.md#data)

#### Defined in

[index.d.ts:1453](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1453)

***

### directory

> **directory**: `void`

`void` for [ZipFileEntry](ZipFileEntry.md) instances.

#### Defined in

[index.d.ts:1516](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1516)

***

### id

> **id**: `number`

The ID of the instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`id`](ZipEntry.md#id)

#### Defined in

[index.d.ts:1457](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1457)

***

### name

> **name**: `string`

The relative filename of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`name`](ZipEntry.md#name)

#### Defined in

[index.d.ts:1449](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1449)

***

### parent?

> `optional` **parent**: [`ZipEntry`](ZipEntry.md)

The parent directory of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`parent`](ZipEntry.md#parent)

#### Defined in

[index.d.ts:1461](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1461)

***

### reader

> **reader**: `ReadableStream`\<`any`\> \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| `ReadableStream`\<`any`\>[] \| [`Reader`](Reader.md)\<`ReaderType`\>

The [Reader](Reader.md) instance used to read the content of the entry.

#### Defined in

[index.d.ts:1520](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1520)

***

### uncompressedSize

> **uncompressedSize**: `number`

The uncompressed size of the content.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`uncompressedSize`](ZipEntry.md#uncompressedsize)

#### Defined in

[index.d.ts:1465](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1465)

***

### writer

> **writer**: `WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`WriterType`\> \| `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `any`, `any`\>

The [Writer](Writer.md) instance used to write the content of the entry.

#### Defined in

[index.d.ts:1530](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1530)

## Methods

### checkPassword()

> **checkPassword**(`password`, `options`?): `Promise`\<`boolean`\>

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

#### Defined in

[index.d.ts:1497](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1497)

***

### clone()

> **clone**(`deepClone`?): [`ZipEntry`](ZipEntry.md)

Clones the entry

#### Parameters

##### deepClone?

`boolean`

`true` to clone all the descendants.

#### Returns

[`ZipEntry`](ZipEntry.md)

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`clone`](ZipEntry.md#clone)

#### Defined in

[index.d.ts:1475](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1475)

***

### getBlob()

> **getBlob**(`mimeType`?, `options`?): `Promise`\<`Blob`\>

Retrieves the content of the entry as a `Blob` instance

#### Parameters

##### mimeType?

`string`

The MIME type of the content.

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`Blob`\>

A promise resolving to a `Blob` instance.

#### Defined in

[index.d.ts:1550](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1550)

***

### getData()

> **getData**(`writer`, `options`?): `Promise`\<`unknown`\>

Retrieves the content of the entry via a [Writer](Writer.md) instance

#### Parameters

##### writer

The [Writer](Writer.md) instance.

`WritableStream`\<`any`\> | [`WritableWriter`](../interfaces/WritableWriter.md) | [`Writer`](Writer.md)\<`unknown`\> | `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `any`, `any`\>

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`unknown`\>

A promise resolving to data associated to the [Writer](Writer.md) instance.

#### Defined in

[index.d.ts:1587](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1587)

***

### getData64URI()

> **getData64URI**(`mimeType`?, `options`?): `Promise`\<`string`\>

Retrieves the content of the entry as as a Data URI `string` encoded in Base64

#### Parameters

##### mimeType?

`string`

The MIME type of the content.

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`string`\>

A promise resolving to a Data URI `string` encoded in Base64.

#### Defined in

[index.d.ts:1558](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1558)

***

### getFullname()

> **getFullname**(): `string`

Returns the full filename of the entry

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getFullname`](ZipEntry.md#getfullname)

#### Defined in

[index.d.ts:1479](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1479)

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getRelativeName`](ZipEntry.md#getrelativename)

#### Defined in

[index.d.ts:1483](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1483)

***

### getText()

> **getText**(`encoding`?, `options`?): `Promise`\<`string`\>

Retrieves the text content of the entry as a `string`

#### Parameters

##### encoding?

`string`

The encoding of the text.

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`string`\>

A promise resolving to a `string`.

#### Defined in

[index.d.ts:1542](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1542)

***

### getUint8Array()

> **getUint8Array**(`options`?): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Retrieves the content of the entry as a `Uint8Array` instance

#### Parameters

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A promise resolving to a `Uint8Array` instance.

#### Defined in

[index.d.ts:1568](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1568)

***

### getWritable()

> **getWritable**(`writable`?, `options`?): `Promise`\<`WritableStream`\<`any`\>\>

Retrieves the content of the entry via a `WritableStream` instance

#### Parameters

##### writable?

`WritableStream`\<`any`\>

The `WritableStream` instance.

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`WritableStream`\<`any`\>\>

A promise resolving to the `WritableStream` instance.

#### Defined in

[index.d.ts:1576](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1576)

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Tests if a [ZipDirectoryEntry](ZipDirectoryEntry.md) instance is an ancestor of the entry

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

The [ZipDirectoryEntry](ZipDirectoryEntry.md) instance.

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isDescendantOf`](ZipEntry.md#isdescendantof)

#### Defined in

[index.d.ts:1489](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1489)

***

### isPasswordProtected()

> **isPasswordProtected**(): `boolean`

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isPasswordProtected`](ZipEntry.md#ispasswordprotected)

#### Defined in

[index.d.ts:1493](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1493)

***

### rename()

> **rename**(`name`): `void`

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`rename`](ZipEntry.md#rename)

#### Defined in

[index.d.ts:1506](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1506)

***

### replaceBlob()

> **replaceBlob**(`blob`): `void`

Replaces the content of the entry with a `Blob` instance

#### Parameters

##### blob

`Blob`

The `Blob` instance.

#### Returns

`void`

#### Defined in

[index.d.ts:1600](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1600)

***

### replaceData64URI()

> **replaceData64URI**(`dataURI`): `void`

Replaces the content of the entry with a Data URI `string` encoded in Base64

#### Parameters

##### dataURI

`string`

The Data URI `string` encoded in Base64.

#### Returns

`void`

#### Defined in

[index.d.ts:1612](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1612)

***

### replaceReadable()

> **replaceReadable**(`readable`): `void`

Replaces the content of the entry with a `ReadableStream` instance

#### Parameters

##### readable

`ReadableStream`\<`any`\>

The `ReadableStream` instance.

#### Returns

`void`

#### Defined in

[index.d.ts:1624](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1624)

***

### replaceText()

> **replaceText**(`text`): `void`

Replaces the content of the entry with a `string`

#### Parameters

##### text

`string`

The `string`.

#### Returns

`void`

#### Defined in

[index.d.ts:1606](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1606)

***

### replaceUint8Array()

> **replaceUint8Array**(`array`): `void`

Replaces the content of the entry with a `Uint8Array` instance

#### Parameters

##### array

`Uint8Array`\<`ArrayBufferLike`\>

The `Uint8Array` instance.

#### Returns

`void`

#### Defined in

[index.d.ts:1618](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L1618)
