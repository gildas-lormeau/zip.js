[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Data64URIWriter

# Class: Data64URIWriter

Represents a [Writer](Writer.md) instance used to retrieve the written data as a Data URI `string` encoded in Base64.

## Extends

- [`Writer`](Writer.md)\<`string`\>

## Constructors

### Constructor

> **new Data64URIWriter**(`mimeString?`): `Data64URIWriter`

Creates the Data64URIWriter instance

#### Parameters

##### mimeString?

`string`

The MIME type of the content.

#### Returns

`Data64URIWriter`

#### Overrides

[`Writer`](Writer.md).[`constructor`](Writer.md#constructor)

## Properties

### contentType?

> `optional` **contentType?**: `string`

The MIME type of the content, i.e. the type declared by the Data URI returned by
[Data64URIWriter#getData](#getdata).

***

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

> **getData**(): `string` \| `Promise`\<`string`\>

Retrieves all the written data

#### Returns

`string` \| `Promise`\<`string`\>

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
