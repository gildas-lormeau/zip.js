[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitDataWriter

# Class: SplitDataWriter

Defined in: [index.d.ts:598](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L598)

Represents a [Writer](Writer.md)  instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md)  instances  (i.e. split zip files).

## Extended by

- [`SplitZipWriter`](SplitZipWriter.md)

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### new SplitDataWriter()

> **new SplitDataWriter**(`writerGenerator`, `maxSize`?): [`SplitDataWriter`](SplitDataWriter.md)

Defined in: [index.d.ts:613](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L613)

Creates the [SplitDataWriter](SplitDataWriter.md) instance

#### Parameters

##### writerGenerator

`AsyncGenerator`\<`WritableStream` \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`\>

A generator of Writer instances.

##### maxSize?

`number`

The maximum size of the data written into [Writer](Writer.md) instances (default: 4GB).

#### Returns

[`SplitDataWriter`](SplitDataWriter.md)

## Properties

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:602](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L602)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:606](https://github.com/gildas-lormeau/zip.js/blob/be8a40fccb32dc320b3cf56a5faf9a609e60a6cb/index.d.ts#L606)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
