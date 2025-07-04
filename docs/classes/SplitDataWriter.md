[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitDataWriter

# Class: SplitDataWriter

Defined in: [index.d.ts:758](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L758)

Represents a [Writer](Writer.md)  instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md)  instances  (i.e. split zip files).

## Extended by

- [`SplitZipWriter`](SplitZipWriter.md)

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new SplitDataWriter**(`writerGenerator`, `maxSize?`): `SplitDataWriter`

Defined in: [index.d.ts:773](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L773)

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

Defined in: [index.d.ts:762](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L762)

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:766](https://github.com/gildas-lormeau/zip.js/blob/f3a32a7ff6dfd704bbdd861b62eec086ef8a7c94/index.d.ts#L766)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
