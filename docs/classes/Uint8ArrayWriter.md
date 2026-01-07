[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Uint8ArrayWriter

# Class: Uint8ArrayWriter

Defined in: [index.d.ts:649](https://github.com/gildas-lormeau/zip.js/blob/9e05e905fd552b90cd16ecfb1b87e46e6d293ef1/index.d.ts#L649)

Represents a [Writer](Writer.md) instance used to retrieve the written data as a `Uint8Array` instance.

## Extends

- [`Writer`](Writer.md)\<`Uint8Array`\<`ArrayBuffer`\>\>

## Constructors

### Constructor

> **new Uint8ArrayWriter**(`defaultBufferSize?`): `Uint8ArrayWriter`

Defined in: [index.d.ts:655](https://github.com/gildas-lormeau/zip.js/blob/9e05e905fd552b90cd16ecfb1b87e46e6d293ef1/index.d.ts#L655)

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

Defined in: [index.d.ts:546](https://github.com/gildas-lormeau/zip.js/blob/9e05e905fd552b90cd16ecfb1b87e46e6d293ef1/index.d.ts#L546)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: [index.d.ts:566](https://github.com/gildas-lormeau/zip.js/blob/9e05e905fd552b90cd16ecfb1b87e46e6d293ef1/index.d.ts#L566)

Retrieves all the written data

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:552](https://github.com/gildas-lormeau/zip.js/blob/9e05e905fd552b90cd16ecfb1b87e46e6d293ef1/index.d.ts#L552)

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

Defined in: [index.d.ts:560](https://github.com/gildas-lormeau/zip.js/blob/9e05e905fd552b90cd16ecfb1b87e46e6d293ef1/index.d.ts#L560)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
