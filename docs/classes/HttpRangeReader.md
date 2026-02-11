[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpRangeReader

# Class: HttpRangeReader

Defined in: [index.d.ts:450](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L450)

Represents a [Reader](Reader.md) instance used to fetch data from servers returning `Accept-Ranges` headers.

## Extends

- [`HttpReader`](HttpReader.md)

## Constructors

### Constructor

> **new HttpRangeReader**(`url`, `options?`): `HttpRangeReader`

Defined in: [index.d.ts:459](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L459)

Creates the HttpRangeReader instance.  It is particularly useful for reading ZIP files via HTTP.
If you just want to add content retrieved via HTTP to a ZIP file, you can simply use
`Response#body` [https://developer.mozilla.org/en-US/docs/Web/API/Response/body](https://developer.mozilla.org/en-US/docs/Web/API/Response/body) instead.

#### Parameters

##### url

The URL of the data.

`string` | `URL`

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

Defined in: [index.d.ts:383](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L383)

The `ReadableStream` instance.

#### Inherited from

[`HttpReader`](HttpReader.md).[`readable`](HttpReader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:387](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L387)

The total size of the data in bytes.

#### Inherited from

[`HttpReader`](HttpReader.md).[`size`](HttpReader.md#size)

## Methods

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:391](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L391)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`HttpReader`](HttpReader.md).[`init`](HttpReader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:399](https://github.com/gildas-lormeau/zip.js/blob/59561e3822efa5891fc25e4e415d5888da8f660a/index.d.ts#L399)

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
