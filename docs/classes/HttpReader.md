[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / HttpReader

# Class: HttpReader

Defined in: [index.d.ts:649](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L649)

Represents a [Reader](Reader.md) instance used to fetch data from a URL.

## Extends

- [`Reader`](Reader.md)\<[`URLString`](../type-aliases/URLString.md)\>

## Extended by

- [`HttpRangeReader`](HttpRangeReader.md)

## Constructors

### Constructor

> **new HttpReader**(`url`, `options?`): `HttpReader`

Defined in: [index.d.ts:656](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L656)

Creates the HttpReader instance

#### Parameters

##### url

`string` \| `URL`

The URL of the data.

##### options?

[`HttpOptions`](../interfaces/HttpOptions.md)

The options.

#### Returns

`HttpReader`

#### Overrides

[`Reader`](Reader.md).[`constructor`](Reader.md#constructor)

## Properties

### readable

> **readable**: `ReadableStream`

Defined in: [index.d.ts:564](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L564)

The `ReadableStream` instance.

#### Inherited from

[`Reader`](Reader.md).[`readable`](Reader.md#readable)

***

### size

> **size**: `number`

Defined in: [index.d.ts:568](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L568)

The total size of the data in bytes.

#### Inherited from

[`Reader`](Reader.md).[`size`](Reader.md#size)

## Methods

### createReadable()

> **createReadable**(`options?`): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:582](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L582)

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

[`Reader`](Reader.md).[`createReadable`](Reader.md#createreadable)

***

### init()?

> `optional` **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:572](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L572)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Reader`](Reader.md).[`init`](Reader.md#init)

***

### readUint8Array()

> **readUint8Array**(`index`, `length`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [index.d.ts:590](https://github.com/gildas-lormeau/zip.js/blob/75e141ac3560996eb2d3371351eecbf5dcff9262/index.d.ts#L590)

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

[`Reader`](Reader.md).[`readUint8Array`](Reader.md#readuint8array)
