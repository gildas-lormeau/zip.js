[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TextWriter

# Class: TextWriter

Represents a [Writer](Writer.md) instance used to retrieve the written data as a `string`.

## Extends

- [`Writer`](Writer.md)\<`string`\>

## Constructors

### new TextWriter()

> **new TextWriter**(`encoding`?): [`TextWriter`](TextWriter.md)

Creates the [TextWriter](TextWriter.md) instance

#### Parameters

##### encoding?

`string`

The encoding of the text.

#### Returns

[`TextWriter`](TextWriter.md)

#### Overrides

[`Writer`](Writer.md).[`constructor`](Writer.md#constructors)

#### Defined in

[index.d.ts:547](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L547)

## Properties

### writable

> **writable**: `WritableStream`\<`any`\>

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

#### Defined in

[index.d.ts:515](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L515)

## Methods

### getData()

> **getData**(): `Promise`\<`string`\>

Retrieves all the written data

#### Returns

`Promise`\<`string`\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

#### Defined in

[index.d.ts:535](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L535)

***

### init()?

> `optional` **init**(`size`?): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Parameters

##### size?

`number`

the total size of the written data in bytes.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`init`](Writer.md#init)

#### Defined in

[index.d.ts:521](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L521)

***

### writeUint8Array()

> **writeUint8Array**(`array`): `Promise`\<`void`\>

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`\<`ArrayBufferLike`\>

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)

#### Defined in

[index.d.ts:529](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L529)
