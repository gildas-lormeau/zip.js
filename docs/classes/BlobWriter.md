[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobWriter

# Class: BlobWriter

Defined in: [index.d.ts:756](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L756)

Represents a [WritableWriter](../interfaces/WritableWriter.md) instance used to retrieve the written data as a `Blob` instance.

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new BlobWriter**(`mimeString?`): `BlobWriter`

Defined in: [index.d.ts:770](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L770)

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

Defined in: [index.d.ts:760](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L760)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### getData()

> **getData**(): `Promise`\<`Blob`\>

Defined in: [index.d.ts:776](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L776)

Retrieves all the written data

#### Returns

`Promise`\<`Blob`\>

A promise resolving to the written data.

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:764](https://github.com/gildas-lormeau/zip.js/blob/e4091a97773d5a308751de1bef94f6a14eacbd39/index.d.ts#L764)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
