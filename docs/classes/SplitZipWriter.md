[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitZipWriter

# ~~Class: SplitZipWriter~~

Defined in: [index.d.ts:756](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L756)

Represents a [Writer](Writer.md) instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md) instances  (i.e. split zip files).

## Deprecated

Use [SplitDataWriter](SplitDataWriter.md) instead.

## Extends

- [`SplitDataWriter`](SplitDataWriter.md)

## Constructors

### Constructor

> **new SplitZipWriter**(`writerGenerator`, `maxSize?`): `SplitZipWriter`

Defined in: [index.d.ts:776](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L776)

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

Defined in: [index.d.ts:765](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L765)

The `WritableStream` instance.

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`writable`](SplitDataWriter.md#writable)

## Methods

### ~~init()~~

> **init**(): `Promise`\<`void`\>

Defined in: [index.d.ts:769](https://github.com/gildas-lormeau/zip.js/blob/49e765ab0ea3b53d3426682f5f01f631cf166a03/index.d.ts#L769)

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`SplitDataWriter`](SplitDataWriter.md).[`init`](SplitDataWriter.md#init)
