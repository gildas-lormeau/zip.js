[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / CreateReadableOptions

# Interface: CreateReadableOptions

Defined in: [index.d.ts:579](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L579)

Represents the options passed to [Reader#createReadable](../classes/Reader.md#createreadable).

## Properties

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [index.d.ts:594](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L594)

The size in bytes of the chunks emitted by the default implementation (the `chunkSize` value
of the global configuration by default).

***

### offset?

> `optional` **offset?**: `number`

Defined in: [index.d.ts:585](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L585)

The byte offset of the start of the range to read.

#### Default Value

```ts
0
```

***

### size?

> `optional` **size?**: `number`

Defined in: [index.d.ts:589](https://github.com/gildas-lormeau/zip.js/blob/ee7e86965087fc3e435df2616f5e02e56e6fab15/index.d.ts#L589)

The size of the range to read in bytes (until the end of the data by default).
