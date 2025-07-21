[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitZipWriter

# Class: ~~SplitZipWriter~~

Defined in: [index.d.ts:754](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L754)

Represents a [Writer](Writer.md) instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md) instances  (i.e. split zip files).

## Deprecated

Use [SplitDataWriter](SplitDataWriter.md) instead.

## Extends

- [`SplitDataWriter`](SplitDataWriter.md)

## Constructors

### Constructor

> **new SplitZipWriter**(`writerGenerator`, `maxSize?`): `SplitZipWriter`

Defined in: [index.d.ts:774](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L774)

Creates the [SplitDataWriter](SplitDataWriter.md) instance

#### Parameters

##### writerGenerator

`AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`\>

A generator of Writer instances.

##### maxSize?

`number`

The maximum size of the data written into [Writer](Writer.md) instances (default: 4GB).

#### Returns

`SplitZipWriter`

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`constructor`](SplitDataWriter.md#constructor)

## Properties

### ~~writable~~

> **writable**: `WritableStream`

Defined in: [index.d.ts:763](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L763)

The `WritableStream` instance.

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`writable`](SplitDataWriter.md#writable)

## Methods

### ~~init()~~

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:767](https://github.com/gildas-lormeau/zip.js/blob/340c4ca9a2c0e59b25fae280b9b6013b4115e27c/index.d.ts#L767)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`init`](SplitDataWriter.md#init)
