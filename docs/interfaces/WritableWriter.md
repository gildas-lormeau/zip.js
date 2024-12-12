[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize**: `number`

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [Entry#getData](Entry.md#getdata) with a generator of [WritableWriter](WritableWriter.md) instances.

#### Defined in

[index.d.ts:483](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L483)

***

### writable

> **writable**: `WritableStream`\<`any`\>

The `WritableStream` instance.

#### Defined in

[index.d.ts:479](https://github.com/gildas-lormeau/zip.js/blob/24ecd74cb4237f29fe97eb10cff1144c3877ce3d/index.d.ts#L479)
