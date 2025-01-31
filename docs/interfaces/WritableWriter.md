[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Defined in: [index.d.ts:475](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L475)

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize**: `number`

Defined in: [index.d.ts:483](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L483)

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [Entry#getData](Entry.md#getdata) with a generator of [WritableWriter](WritableWriter.md) instances.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:479](https://github.com/gildas-lormeau/zip.js/blob/6e0fd98b749fcfd4608f898ad72964d533d72ffa/index.d.ts#L479)

The `WritableStream` instance.
