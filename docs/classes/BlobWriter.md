[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / BlobWriter

# Class: BlobWriter

Represents a [WritableWriter](../interfaces/WritableWriter.md) instance used to retrieve the written data as a `Blob` instance.

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### new BlobWriter()

> **new BlobWriter**(`mimeString`?): [`BlobWriter`](BlobWriter.md)

Creates the [BlobWriter](BlobWriter.md) instance

#### Parameters

##### mimeString?

`string`

The MIME type of the content.

#### Returns

[`BlobWriter`](BlobWriter.md)

#### Defined in

[index.d.ts:567](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L567)

## Properties

### writable

> **writable**: `WritableStream`\<`any`\>

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

#### Defined in

[index.d.ts:557](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L557)

## Methods

### getData()

> **getData**(): `Promise`\<`Blob`\>

Retrieves all the written data

#### Returns

`Promise`\<`Blob`\>

A promise resolving to the written data.

#### Defined in

[index.d.ts:573](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L573)

***

### init()

> **init**(): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)

#### Defined in

[index.d.ts:561](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L561)
