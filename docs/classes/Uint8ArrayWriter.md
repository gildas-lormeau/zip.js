[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Uint8ArrayWriter

# Class: Uint8ArrayWriter

Defined in: [index.d.ts:911](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L911)

Represents a [Writer](Writer.md) instance used to retrieve the written data as a `Uint8Array` instance.

## Extends

- [`Writer`](Writer.md)\<`Uint8Array`\<`ArrayBuffer`\>\>

## Constructors

### Constructor

> **new Uint8ArrayWriter**(`defaultBufferSize?`): `Uint8ArrayWriter`

Defined in: [index.d.ts:917](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L917)

Creates the Uint8ArrayWriter instance

#### Parameters

##### defaultBufferSize?

`number`

The initial size of the internal buffer (default: 256KB).

#### Returns

`Uint8ArrayWriter`

#### Overrides

[`Writer`](Writer.md).[`constructor`](Writer.md#constructor)

## Properties

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:788](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L788)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: [index.d.ts:808](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L808)

Retrieves all the written data

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:794](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L794)

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

Defined in: [index.d.ts:802](https://github.com/gildas-lormeau/zip.js/blob/6a2b06eb4f439b1463374b63dabc0480c3b8753a/index.d.ts#L802)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
