[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TextWriter

# Class: TextWriter

Defined in: [index.d.ts:702](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L702)

Represents a [Writer](Writer.md) instance used to retrieve the written data as a `string`.

## Extends

- [`Writer`](Writer.md)\<`string`\>

## Constructors

### Constructor

> **new TextWriter**(`encoding?`): `TextWriter`

Defined in: [index.d.ts:708](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L708)

Creates the TextWriter instance

#### Parameters

##### encoding?

`string`

The encoding of the text.

#### Returns

`TextWriter`

#### Overrides

[`Writer`](Writer.md).[`constructor`](Writer.md#constructor)

## Properties

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:676](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L676)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`string`\>

Defined in: [index.d.ts:696](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L696)

Retrieves all the written data

#### Returns

`Promise`\<`string`\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size?`): `Promise`\<`void`\>

Defined in: [index.d.ts:682](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L682)

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

Defined in: [index.d.ts:690](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L690)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
