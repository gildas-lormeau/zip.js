[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Uint8ArrayWriter

# Class: Uint8ArrayWriter

Represents a [Writer](Writer.md)  instance used to retrieve the written data as a `Uint8Array` instance.

## Extends

- [`Writer`](Writer.md)\<`Uint8Array`\>

## Constructors

### new Uint8ArrayWriter()

> **new Uint8ArrayWriter**(): [`Uint8ArrayWriter`](Uint8ArrayWriter.md)

#### Returns

[`Uint8ArrayWriter`](Uint8ArrayWriter.md)

#### Inherited from

[`Writer`](Writer.md).[`constructor`](Writer.md#constructors)

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

> **getData**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Retrieves all the written data

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

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
