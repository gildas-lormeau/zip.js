[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpRangeReader

# Class: HttpRangeReader

Defined in: [index.d.ts:752](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L752)

Represents a [Reader](Reader.md) instance used to fetch data from servers returning `Accept-Ranges` headers.

## Extends

- [`HttpReader`](HttpReader.md)

## Constructors

### Constructor

> **new HttpRangeReader**(`url`, `options?`): `HttpRangeReader`

Defined in: [index.d.ts:761](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L761)

Creates the HttpRangeReader instance.  It is particularly useful for reading ZIP files via HTTP.
If you just want to add content retrieved via HTTP to a ZIP file, you can simply use
`Response#body` [https://developer.mozilla.org/en-US/docs/Web/API/Response/body](https://developer.mozilla.org/en-US/docs/Web/API/Response/body) instead.

#### Parameters

##### url

`string` \| `URL`

The URL of the data.

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

Defined in: [index.d.ts:654](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L654)

The `ReadableStream` instance.

#### Inherited from

[`HttpReader`](HttpReader.md).[`readable`](HttpReader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:658](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L658)

The total size of the data in bytes.

#### Inherited from

[`HttpReader`](HttpReader.md).[`size`](HttpReader.md#size)

## Methods

### createReadable()

> **createReadable**(`options?`): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:672](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L672)

Creates a `ReadableStream` of the data, optionally restricted to a byte range.

The default implementation reads the data with [Reader#readUint8Array](Reader.md#readuint8array). Custom readers can
override this method to return a stream provided natively by the underlying data source.

#### Parameters

##### options?

[`CreateReadableOptions`](../interfaces/CreateReadableOptions.md)

The options.

#### Returns

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The `ReadableStream` instance.

#### Inherited from

[`HttpReader`](HttpReader.md).[`createReadable`](HttpReader.md#createreadable)

***

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:662](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L662)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`HttpReader`](HttpReader.md).[`init`](HttpReader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:680](https://github.com/gildas-lormeau/zip.js/blob/73cfa02ff8cf16ec80308b1759f9f3b000080d00/index.d.ts#L680)

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

A promise resolving to a chunk of data. The data must be trucated to the remaining size if the requested length is larger than the remaining size.

#### Inherited from

[`HttpReader`](HttpReader.md).[`readUint8Array`](HttpReader.md#readuint8array)
