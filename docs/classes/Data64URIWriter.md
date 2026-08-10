[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Data64URIWriter

# Class: Data64URIWriter

Defined in: [index.d.ts:844](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L844)

Represents a [Writer](Writer.md) instance used to retrieve the written data as a Data URI `string` encoded in Base64.

## Extends

- [`Writer`](Writer.md)\<`string`\>

## Constructors

### Constructor

> **new Data64URIWriter**(`mimeString?`): `Data64URIWriter`

Defined in: [index.d.ts:850](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L850)

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

Defined in: [index.d.ts:780](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L780)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`string`\>

Defined in: [index.d.ts:800](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L800)

Retrieves all the written data

#### Returns

`Promise`\<`string`\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:786](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L786)

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

Defined in: [index.d.ts:794](https://github.com/gildas-lormeau/zip.js/blob/6fc5ad99d22ab1d46e0da07f84168596974a964b/index.d.ts#L794)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
