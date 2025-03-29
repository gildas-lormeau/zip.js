[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / TextWriter

# Class: TextWriter

Defined in: [index.d.ts:536](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L536)

Represents a [Writer](Writer.md) instance used to retrieve the written data as a `string`.

## Extends

- [`Writer`](Writer.md)\<`string`\>

## Constructors

### Constructor

> **new TextWriter**(`encoding`?): `TextWriter`

Defined in: [index.d.ts:542](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L542)

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

Defined in: [index.d.ts:510](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L510)

The `WritableStream` instance.

#### Inherited from

[`Writer`](Writer.md).[`writable`](Writer.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`string`\>

Defined in: [index.d.ts:530](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L530)

Retrieves all the written data

#### Returns

`Promise`\<`string`\>

A promise resolving to the written data.

#### Inherited from

[`Writer`](Writer.md).[`getData`](Writer.md#getdata)

***

### init()?

> `optional` **init**(`size`?): `Promise`\<`void`\>

Defined in: [index.d.ts:516](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L516)

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

Defined in: [index.d.ts:524](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L524)

Appends a chunk of data

#### Parameters

##### array

`Uint8Array`\<`ArrayBuffer`\>

The chunk data to append.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Writer`](Writer.md).[`writeUint8Array`](Writer.md#writeuint8array)
