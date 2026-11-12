[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Uint8ArrayWriter

# Class: Uint8ArrayWriter

Represents a [Writer](Writer.md) instance used to retrieve the written data as a `Uint8Array` instance.

## Remarks

When reading an entry, the buffer is allocated upfront from the declared [EntryMetaData#uncompressedSize](../interfaces/EntryMetaData.md#uncompressedsize),
capped at 1032 times [EntryMetaData#compressedSize](../interfaces/EntryMetaData.md#compressedsize) (the maximum expansion ratio of deflate). The declared size
is not verified before the allocation, so check it against the limit your application accepts when the zip file
comes from an untrusted source.

## Extends

- [`Writer`](Writer.md)\<`Uint8Array`\<`ArrayBuffer`\>\>

## Constructors

### Constructor

> **new Uint8ArrayWriter**(`defaultBufferSize?`): `Uint8ArrayWriter`

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

### size

> **size**: `number`

The number of bytes written into the instance.

#### Inherited from

[`Writer`](Writer.md).[`size`](Writer.md#size)

***

### writable

> **writable**: `WritableStream`

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Uint8Array`\<`ArrayBuffer`\> \| `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Retrieves all the written data

#### Returns

`Uint8Array`\<`ArrayBuffer`\> \| `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

The written data, or a promise resolving to it.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `void` \| `Promise`\<`void`\>

Initializes the instance, synchronously or asynchronously

#### Parameters

##### size?

`number`

the total size of the written data in bytes.

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`init`](Writer.md#init)

***

### writeUint8Array()

> **writeUint8Array**(`array`): `void` \| `Promise`\<`void`\>

Appends a chunk of data, synchronously or asynchronously

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
