[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitZipWriter

# Class: ~~SplitZipWriter~~

Defined in: [index.d.ts:588](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L588)

Represents a [Writer](Writer.md) instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md) instances  (i.e. split zip files).

## Deprecated

Use [SplitDataWriter](SplitDataWriter.md) instead.

## Extends

- [`SplitDataWriter`](SplitDataWriter.md)

## Constructors

### Constructor

> **new SplitZipWriter**(`writerGenerator`, `maxSize`?): `SplitZipWriter`

Defined in: [index.d.ts:608](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L608)

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

Defined in: [index.d.ts:597](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L597)

The `WritableStream` instance.

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`writable`](SplitDataWriter.md#writable)

## Methods

### ~~init()~~

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:601](https://github.com/gildas-lormeau/zip.js/blob/251b484ba01a922c47b1394efacb8926682f5796/index.d.ts#L601)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`init`](SplitDataWriter.md#init)
