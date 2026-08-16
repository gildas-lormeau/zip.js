[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / SplitDataWriter

# Class: SplitDataWriter

Represents a [Writer](Writer.md)  instance used to retrieve the written data from a generator of [WritableWriter](../interfaces/WritableWriter.md)  instances  (i.e. split zip files).

## Implements

- [`Initializable`](../interfaces/Initializable.md)
- [`WritableWriter`](../interfaces/WritableWriter.md)

## Constructors

### Constructor

> **new SplitDataWriter**(`writerGenerator`, `maxSize?`): `SplitDataWriter`

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

### availableSize

> **availableSize**: `number`

The number of bytes still available on the disk being written.

***

### diskNumber

> **diskNumber**: `number`

The number of the disk being written.

***

### diskOffset

> **diskOffset**: `number`

The byte offset of the disk being written.

***

### maxSize

> **maxSize**: `number`

The maximum size of each disk in bytes.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`maxSize`](../interfaces/WritableWriter.md#maxsize)

***

### writable

> **writable**: `WritableStream`

The `WritableStream` instance.

#### Implementation of

[`WritableWriter`](../interfaces/WritableWriter.md).[`writable`](../interfaces/WritableWriter.md#writable)

## Methods

### closeDisk()

> **closeDisk**(): `Promise`\<`void`\>

Closes the disk being written, the next disk being opened when more data is written

#### Returns

`Promise`\<`void`\>

***

### init()

> **init**(): `Promise`\<`void`\>

Initializes the instance asynchronously

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Initializable`](../interfaces/Initializable.md).[`init`](../interfaces/Initializable.md#init)
