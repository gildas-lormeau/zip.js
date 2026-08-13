[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / ZipFileEntry

# Class: ZipFileEntry\<ReaderType, WriterType\>

Defined in: [index.d.ts:2534](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2534)

Represents a file entry in the zip (Filesystem API).

## Extends

- [`ZipEntry`](ZipEntry.md)

## Type Parameters

### ReaderType

`ReaderType`

### WriterType

`WriterType`

## Constructors

### Constructor

> **new ZipFileEntry**\<`ReaderType`, `WriterType`\>(): `ZipFileEntry`\<`ReaderType`, `WriterType`\>

#### Returns

`ZipFileEntry`\<`ReaderType`, `WriterType`\>

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`constructor`](ZipEntry.md#constructor)

## Properties

### children

> **children**: [`ZipEntry`](ZipEntry.md)[]

Defined in: [index.d.ts:2491](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2491)

The children of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`children`](ZipEntry.md#children)

***

### data?

> `optional` **data?**: [`EntryMetaData`](../interfaces/EntryMetaData.md)

Defined in: [index.d.ts:2475](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2475)

The underlying [EntryMetaData](../interfaces/EntryMetaData.md) instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`data`](ZipEntry.md#data)

***

### directory

> **directory**: `void`

Defined in: [index.d.ts:2538](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2538)

`void` for ZipFileEntry instances.

***

### id

> **id**: `number`

Defined in: [index.d.ts:2479](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2479)

The ID of the instance.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`id`](ZipEntry.md#id)

***

### name

> **name**: `string`

Defined in: [index.d.ts:2471](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2471)

The relative filename of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`name`](ZipEntry.md#name)

***

### parent?

> `optional` **parent?**: [`ZipEntry`](ZipEntry.md)

Defined in: [index.d.ts:2483](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2483)

The parent directory of the entry.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`parent`](ZipEntry.md#parent)

***

### reader

> **reader**: `ReadableStream`\<`any`\> \| `ReadableStream`\<`any`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md) \| [`Reader`](Reader.md)\<`unknown`\>[] \| [`ReadableReader`](../interfaces/ReadableReader.md)[] \| [`Reader`](Reader.md)\<`ReaderType`\>

Defined in: [index.d.ts:2542](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2542)

The [Reader](Reader.md) instance used to read the content of the entry.

***

### uncompressedSize

> **uncompressedSize**: `number`

Defined in: [index.d.ts:2487](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2487)

The uncompressed size of the content.

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`uncompressedSize`](ZipEntry.md#uncompressedsize)

***

### writer

> **writer**: `WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`WriterType`\> \| `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `any`, `any`\>

Defined in: [index.d.ts:2552](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2552)

The [Writer](Writer.md) instance used to write the content of the entry.

## Methods

### checkPassword()

> **checkPassword**(`password`, `options?`): `Promise`\<`boolean`\>

Defined in: [index.d.ts:2519](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2519)

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

Defined in: [index.d.ts:2497](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2497)

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

### getArrayBuffer()

> **getArrayBuffer**(`options?`): `Promise`\<`ArrayBuffer`\>

Defined in: [index.d.ts:2623](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2623)

Retrieves the content of the entry as an `ArrayBuffer` instance

#### Parameters

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`ArrayBuffer`\>

A promise resolving to an `ArrayBuffer` instance.

***

### getBlob()

> **getBlob**(`mimeType?`, `options?`): `Promise`\<`Blob`\>

Defined in: [index.d.ts:2572](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2572)

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

***

### getData()

> **getData**\<`Type`\>(`writer`, `options?`): `Promise`\<`Type`\>

Defined in: [index.d.ts:2609](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2609)

Retrieves the content of the entry via a [Writer](Writer.md) instance

#### Type Parameters

##### Type

`Type`

#### Parameters

##### writer

`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\> \| `AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `any`, `any`\>

The [Writer](Writer.md) instance.

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`Type`\>

A promise resolving to data associated to the [Writer](Writer.md) instance.

***

### getData64URI()

> **getData64URI**(`mimeType?`, `options?`): `Promise`\<`string`\>

Defined in: [index.d.ts:2580](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2580)

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

***

### getFullname()

> **getFullname**(): `string`

Defined in: [index.d.ts:2501](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2501)

Returns the full filename of the entry

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getFullname`](ZipEntry.md#getfullname)

***

### getRelativeName()

> **getRelativeName**(`ancestor`): `string`

Defined in: [index.d.ts:2505](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2505)

Returns the filename of the entry relative to a parent directory

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

#### Returns

`string`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`getRelativeName`](ZipEntry.md#getrelativename)

***

### getText()

> **getText**(`encoding?`, `options?`): `Promise`\<`string`\>

Defined in: [index.d.ts:2564](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2564)

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

***

### getUint8Array()

> **getUint8Array**(`options?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:2590](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2590)

Retrieves the content of the entry as a `Uint8Array` instance

#### Parameters

##### options?

[`EntryGetDataOptions`](../interfaces/EntryGetDataOptions.md)

The options.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A promise resolving to a `Uint8Array` instance.

***

### getWritable()

> **getWritable**(`writable?`, `options?`): `Promise`\<`WritableStream`\<`any`\>\>

Defined in: [index.d.ts:2598](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2598)

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

***

### isDescendantOf()

> **isDescendantOf**(`ancestor`): `boolean`

Defined in: [index.d.ts:2511](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2511)

Tests if a [ZipDirectoryEntry](ZipDirectoryEntry.md) instance is an ancestor of the entry

#### Parameters

##### ancestor

[`ZipDirectoryEntry`](ZipDirectoryEntry.md)

The [ZipDirectoryEntry](ZipDirectoryEntry.md) instance.

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isDescendantOf`](ZipEntry.md#isdescendantof)

***

### isPasswordProtected()

> **isPasswordProtected**(): `boolean`

Defined in: [index.d.ts:2515](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2515)

Tests if the entry or any of its children is password protected

#### Returns

`boolean`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`isPasswordProtected`](ZipEntry.md#ispasswordprotected)

***

### rename()

> **rename**(`name`): `void`

Defined in: [index.d.ts:2528](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2528)

Set the name of the entry

#### Parameters

##### name

`string`

The new name of the entry.

#### Returns

`void`

#### Inherited from

[`ZipEntry`](ZipEntry.md).[`rename`](ZipEntry.md#rename)

***

### replaceBlob()

> **replaceBlob**(`blob`): `void`

Defined in: [index.d.ts:2629](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2629)

Replaces the content of the entry with a `Blob` instance

#### Parameters

##### blob

`Blob`

The `Blob` instance.

#### Returns

`void`

***

### replaceData64URI()

> **replaceData64URI**(`dataURI`): `void`

Defined in: [index.d.ts:2641](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2641)

Replaces the content of the entry with a Data URI `string` encoded in Base64

#### Parameters

##### dataURI

`string`

The Data URI `string` encoded in Base64.

#### Returns

`void`

***

### replaceReadable()

> **replaceReadable**(`readable`): `void`

Defined in: [index.d.ts:2653](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2653)

Replaces the content of the entry with a `ReadableStream` instance

#### Parameters

##### readable

`ReadableStream`

The `ReadableStream` instance.

#### Returns

`void`

***

### replaceText()

> **replaceText**(`text`): `void`

Defined in: [index.d.ts:2635](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2635)

Replaces the content of the entry with a `string`

#### Parameters

##### text

`string`

The `string`.

#### Returns

`void`

***

### replaceUint8Array()

> **replaceUint8Array**(`array`): `void`

Defined in: [index.d.ts:2647](https://github.com/gildas-lormeau/zip.js/blob/7ba4f706201f50288c5cdcca10c73dfd5e5471c6/index.d.ts#L2647)

Replaces the content of the entry with a `Uint8Array` instance

#### Parameters

##### array

`Uint8Array`

The `Uint8Array` instance.

#### Returns

`void`
