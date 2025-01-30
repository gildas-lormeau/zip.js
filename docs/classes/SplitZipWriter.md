[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitZipWriter

# Class: ~~SplitZipWriter~~

Defined in: [index.d.ts:593](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L593)

Represents a [Writer](Writer.md) instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md) instances  (i.e. split zip files).

## Deprecated

Use [SplitDataWriter](SplitDataWriter.md) instead.

## Extends

- [`SplitDataWriter`](SplitDataWriter.md)

## Constructors

### new SplitZipWriter()

> **new SplitZipWriter**(`writerGenerator`, `maxSize`?): [`SplitZipWriter`](SplitZipWriter.md)

Defined in: [index.d.ts:613](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L613)

Creates the [SplitDataWriter](SplitDataWriter.md) instance

#### Parameters

##### writerGenerator

`AsyncGenerator`\<`WritableStream` \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`\>

A generator of Writer instances.

##### maxSize?

`number`

The maximum size of the data written into [Writer](Writer.md) instances (default: 4GB).

#### Returns

[`SplitZipWriter`](SplitZipWriter.md)

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`constructor`](SplitDataWriter.md#constructors)

## Properties

### ~~writable~~

> **writable**: `WritableStream`

Defined in: [index.d.ts:602](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L602)

The `WritableStream` instance.

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`writable`](SplitDataWriter.md#writable)

## Methods

### ~~init()~~

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:606](https://github.com/gildas-lormeau/zip.js/blob/d0e6c1395e38b4516517dbdf3097589fab5ed02c/index.d.ts#L606)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`init`](SplitDataWriter.md#init)
