[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Uint8ArrayWriter

# Class: Uint8ArrayWriter

Defined in: [index.d.ts:638](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L638)

Represents a [Writer](Writer.md) instance used to retrieve the written data as a `Uint8Array` instance.

## Extends

- [`Writer`](Writer.md)\<`Uint8Array`\<`ArrayBuffer`\>\>

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

Defined in: [index.d.ts:535](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L535)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: [index.d.ts:555](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L555)

Retrieves all the written data

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:541](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L541)

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

Defined in: [index.d.ts:549](https://github.com/gildas-lormeau/zip.js/blob/c6ab5788eadb09dbc23208b1e438b2eec4ffa531/index.d.ts#L549)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
