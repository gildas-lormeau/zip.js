[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Uint8ArrayWriter

# Class: Uint8ArrayWriter

Defined in: [index.d.ts:785](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L785)

Represents a [Writer](Writer.md)  instance used to retrieve the written data as a `Uint8Array` instance.

## Extends

- [`Writer`](Writer.md)\<`Uint8Array`\>

## Constructors

### Constructor

> **new Uint8ArrayWriter**(): `Uint8ArrayWriter`

#### Returns

`Uint8ArrayWriter`

#### Inherited from

[`Writer`](Writer.md).[`constructor`](Writer.md#constructor)

## Properties

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:675](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L675)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:695](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L695)

Retrieves all the written data

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:681](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L681)

Initializes the instance asynchronously

#### Parameters

##### size?

`number`

the total size of the written data in bytes.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`init`](Writer.md#init)

***

### writeUint8Array()

> **writeUint8Array**(`array`): `Promise`\<`void`\>

Defined in: [index.d.ts:689](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L689)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
