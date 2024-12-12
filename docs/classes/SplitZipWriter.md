[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitZipWriter

# Class: ~~SplitZipWriter~~

Represents a [Writer](Writer.md) instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md) instances  (i.e. split zip files).

## Deprecated

Use [SplitDataWriter](SplitDataWriter.md) instead.

## Extends

- [`SplitDataWriter`](SplitDataWriter.md)

## Constructors

### new SplitZipWriter()

> **new SplitZipWriter**(`writerGenerator`, `maxSize`?): [`SplitZipWriter`](SplitZipWriter.md)

Creates the [SplitDataWriter](SplitDataWriter.md) instance

#### Parameters

##### writerGenerator

`AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`, `any`\>

A generator of Writer instances.

##### maxSize?

`number`

The maximum size of the data written into [Writer](Writer.md) instances (default: 4GB).

#### Returns

[`SplitZipWriter`](SplitZipWriter.md)

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`constructor`](SplitDataWriter.md#constructors)

#### Defined in

[index.d.ts:613](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L613)

## Properties

### ~~writable~~

> **writable**: `WritableStream`\<`any`\>

The `WritableStream` instance.

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`writable`](SplitDataWriter.md#writable)

#### Defined in

[index.d.ts:602](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L602)

## Methods

### ~~init()~~

> **init**(): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`init`](SplitDataWriter.md#init)

#### Defined in

[index.d.ts:606](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L606)
