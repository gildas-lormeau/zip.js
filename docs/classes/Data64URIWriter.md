[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Data64URIWriter

# Class: Data64URIWriter

Defined in: [index.d.ts:739](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L739)

Represents a [Writer](Writer.md) instance used to retrieve the written data as a Data URI `string` encoded in Base64.

## Extends

- [`Writer`](Writer.md)\<`string`\>

## Constructors

### Constructor

> **new Data64URIWriter**(`mimeString?`): `Data64URIWriter`

Defined in: [index.d.ts:745](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L745)

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

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:675](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L675)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`string`\>

Defined in: [index.d.ts:695](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L695)

Retrieves all the written data

#### Returns

`Promise`\<`string`\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:681](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L681)

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

Defined in: [index.d.ts:689](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L689)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
