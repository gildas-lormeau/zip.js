[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / Data64URIWriter

# Class: Data64URIWriter

Defined in: [index.d.ts:740](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L740)

Represents a [Writer](Writer.md) instance used to retrieve the written data as a Data URI `string` encoded in Base64.

## Extends

- [`Writer`](Writer.md)\<`string`\>

## Constructors

### Constructor

> **new Data64URIWriter**(`mimeString?`): `Data64URIWriter`

Defined in: [index.d.ts:746](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L746)

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

Defined in: [index.d.ts:676](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L676)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`string`\>

Defined in: [index.d.ts:696](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L696)

Retrieves all the written data

#### Returns

`Promise`\<`string`\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:682](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L682)

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

Defined in: [index.d.ts:690](https://github.com/gildas-lormeau/zip.js/blob/cd8507443514e12617ac25921566eb3131bcdbff/index.d.ts#L690)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
