[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpRangeReader

# Class: HttpRangeReader

Defined in: [index.d.ts:575](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L575)

Represents a [Reader](Reader.md) instance used to fetch data from servers returning `Accept-Ranges` headers.

## Extends

- [`HttpReader`](HttpReader.md)

## Constructors

### Constructor

> **new HttpRangeReader**(`url`, `options?`): `HttpRangeReader`

Defined in: [index.d.ts:582](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L582)

Creates the HttpRangeReader instance

#### Parameters

##### url

The URL of the data.

`URL` | [`URLString`](../interfaces/URLString.md)

##### options?

[`HttpRangeOptions`](../interfaces/HttpRangeOptions.md)

The options.

#### Returns

`HttpRangeReader`

#### Overrides

[`HttpReader`](HttpReader.md).[`constructor`](HttpReader.md#constructor)

## Properties

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:502](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L502)

The `ReadableStream` instance.

#### Inherited from

[`HttpReader`](HttpReader.md).[`readable`](HttpReader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:506](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L506)

The total size of the data in bytes.

#### Inherited from

[`HttpReader`](HttpReader.md).[`size`](HttpReader.md#size)

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:510](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L510)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`HttpReader`](HttpReader.md).[`init`](HttpReader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:518](https://github.com/gildas-lormeau/zip.js/blob/93e5cfb75d3abfbb07c60a453452660b0c4b1526/index.d.ts#L518)

Reads a chunk of data

#### Parameters

##### index

`number`

The byte index of the data to read.

##### length

`number`

The length of the data to read in bytes.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

A promise resolving to a chunk of data.

#### Inherited from

[`HttpReader`](HttpReader.md).[`readUint8Array`](HttpReader.md#readuint8array)
