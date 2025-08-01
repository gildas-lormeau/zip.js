[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobWriter

# Class: BlobWriter

Defined in: [index.d.ts:716](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L716)

Represents a [WritableWriter](../interfaces/WritableWriter.md) instance used to retrieve the written data as a `Blob` instance.

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new BlobWriter**(`mimeString?`): `BlobWriter`

Defined in: [index.d.ts:730](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L730)

Creates the BlobWriter instance

#### Parameters

##### mimeString?

`string`

The MIME type of the content.

#### Returns

`BlobWriter`

## Properties

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:720](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L720)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Blob`\>

Defined in: [index.d.ts:736](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L736)

Retrieves all the written data

#### Returns

`Promise`\<`Blob`\>

A promise resolving to the written data.

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:724](https://github.com/gildas-lormeau/zip.js/blob/f5689a69f57baaaa10605a11a4516e7cc749e4a1/index.d.ts#L724)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
