[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / WritableWriter

# Interface: WritableWriter

Defined in: [index.d.ts:470](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L470)

Represents an instance used to write data into a `WritableStream` instance.

## Properties

### maxSize?

> `optional` **maxSize**: `number`

Defined in: [index.d.ts:478](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L478)

The maximum size of split data when creating a [ZipWriter](../classes/ZipWriter.md) instance or when calling [Entry#getData](Entry.md#getdata) with a generator of WritableWriter instances.

***

### writable

> **writable**: `WritableStream`

Defined in: [index.d.ts:474](https://github.com/gildas-lormeau/zip.js/blob/00105a96aa8272ce26bff0eea7ebcfd6071ad540/index.d.ts#L474)

The `WritableStream` instance.
