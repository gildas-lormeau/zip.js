[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitDataWriter

# Class: SplitDataWriter

Defined in: [index.d.ts:759](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L759)

Represents a [Writer](Writer.md)  instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md)  instances  (i.e. split zip files).

## Extended by

- [`SplitZipWriter`](SplitZipWriter.md)

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new SplitDataWriter**(`writerGenerator`, `maxSize?`): `SplitDataWriter`

Defined in: [index.d.ts:774](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L774)

Creates the SplitDataWriter instance

#### Parameters

##### writerGenerator

`AsyncGenerator`\<`WritableStream`\<`any`\> \| [`WritableWriter`](../interfaces/WritableWriter.md) \| [`Writer`](Writer.md)\<`unknown`\>, `boolean`\>

A generator of Writer instances.

##### maxSize?

`number`

The maximum size of the data written into [Writer](Writer.md) instances (default: 4GB).

#### Returns

`SplitDataWriter`

## Properties

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:763](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L763)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:767](https://github.com/gildas-lormeau/zip.js/blob/0ff014cd43c06ee35ed26f2c2f89837d8f86c870/index.d.ts#L767)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
